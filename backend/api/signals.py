# api/signals.py
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import CustomUser, Doctor, Patient, Bed, Appointment, Medicine, Diagnosis
import logging

# Configure console logger for audit trails
logger = logging.getLogger('audit_console')
logger.setLevel(logging.INFO)

# Create console handler if it doesn't exist
if not logger.handlers:
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        '🔍 AUDIT LOG [{asctime}] {levelname}: {message}',
        style='{',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

@receiver(post_save, sender=CustomUser)
def create_doctor_profile(sender, instance, created, **kwargs):
    """
    Automatically create a Doctor profile when a CustomUser with the 'doctor' role is created.
    """
    if created and instance.role == 'doctor':
        Doctor.objects.create(user=instance)
        logger.info(f"👨‍⚕️ NEW DOCTOR CREATED: {instance.username} ({instance.get_full_name()}) - Role: {instance.role}")

@receiver(post_save, sender=CustomUser)
def save_doctor_profile(sender, instance, **kwargs):
    """
    Ensure the profile is saved when the user is saved.
    """
    if instance.role == 'doctor' and hasattr(instance, 'doctor_profile'):
        instance.doctor_profile.save()

@receiver(pre_save, sender=Patient)
def track_bed_changes(sender, instance, **kwargs):
    """
    Store the old bed assignment before saving to track changes.
    """
    if instance.pk:
        try:
            old_instance = Patient.objects.get(pk=instance.pk)
            instance._old_assigned_bed = old_instance.assigned_bed
        except Patient.DoesNotExist:
            instance._old_assigned_bed = None
    else:
        instance._old_assigned_bed = None

@receiver(post_save, sender=Patient)
def update_bed_occupancy_on_patient_save(sender, instance, created, **kwargs):
    """
    Automatically update bed occupancy when patient bed assignment changes.
    """
    old_bed = getattr(instance, '_old_assigned_bed', None)
    new_bed = instance.assigned_bed
    
    # Log patient creation or update
    if created:
        bed_info = f" | Bed: {new_bed}" if new_bed else " | No bed assigned"
        doctor_info = f" | Doctor: {instance.assigned_doctor}" if instance.assigned_doctor else " | No doctor assigned"
        logger.info(f"👤 NEW PATIENT CREATED: {instance.name} (ID: {instance.id}) | Age: {instance.age} | Gender: {instance.gender}{bed_info}{doctor_info}")
    else:
        logger.info(f"👤 PATIENT UPDATED: {instance.name} (ID: {instance.id})")
    
    # If old bed exists and is different from new bed, mark it as unoccupied
    if old_bed and old_bed != new_bed:
        old_bed.is_occupied = False
        old_bed.save()
        logger.info(f"🛏️ BED FREED: {old_bed} | Patient: {instance.name} moved out")
    
    # If new bed exists, mark it as occupied
    if new_bed:
        new_bed.is_occupied = True
        new_bed.save()
        if old_bed != new_bed:  # Only log if bed actually changed
            logger.info(f"🛏️ BED ASSIGNED: {new_bed} | Patient: {instance.name} moved in")

@receiver(post_delete, sender=Patient)
def update_bed_occupancy_on_patient_delete(sender, instance, **kwargs):
    """
    Mark bed as unoccupied when patient is deleted.
    """
    logger.info(f"🗑️ PATIENT DELETED: {instance.name} (ID: {instance.id})")
    if instance.assigned_bed:
        instance.assigned_bed.is_occupied = False
        instance.assigned_bed.save()
        logger.info(f"🛏️ BED FREED: {instance.assigned_bed} | Patient {instance.name} deleted")

# Appointment Audit Logging
@receiver(post_save, sender=Appointment)
def log_appointment_changes(sender, instance, created, **kwargs):
    """
    Log appointment creation and updates.
    """
    if created:
        logger.info(f"📅 NEW APPOINTMENT CREATED: Patient {instance.patient.name} with Dr. {instance.doctor} | Date: {instance.appointment_date} at {instance.appointment_time} | Status: {instance.status}")
    else:
        logger.info(f"📅 APPOINTMENT UPDATED: ID {instance.id} | Patient: {instance.patient.name} | Status: {instance.status} | Date: {instance.appointment_date}")

@receiver(post_delete, sender=Appointment)
def log_appointment_deletion(sender, instance, **kwargs):
    """
    Log appointment deletions.
    """
    logger.info(f"🗑️ APPOINTMENT DELETED: ID {instance.id} | Patient: {instance.patient.name} | Date: {instance.appointment_date}")

# Medicine Audit Logging
@receiver(post_save, sender=Medicine)
def log_medicine_prescription(sender, instance, created, **kwargs):
    """
    Log medicine prescriptions and updates.
    """
    if created:
        logger.info(f"💊 NEW MEDICINE PRESCRIBED: {instance.medicine_name} ({instance.dosage}) | Patient: {instance.patient.name} | Frequency: {instance.frequency} | Days: {instance.no_of_days}")
    else:
        logger.info(f"💊 MEDICINE PRESCRIPTION UPDATED: ID {instance.id} | {instance.medicine_name} | Patient: {instance.patient.name}")

@receiver(post_delete, sender=Medicine)
def log_medicine_deletion(sender, instance, **kwargs):
    """
    Log medicine prescription deletions.
    """
    logger.info(f"🗑️ MEDICINE PRESCRIPTION DELETED: {instance.medicine_name} | Patient: {instance.patient.name}")

# Diagnosis Audit Logging
@receiver(post_save, sender=Diagnosis)
def log_diagnosis_changes(sender, instance, created, **kwargs):
    """
    Log diagnosis creation and updates.
    """
    if created:
        logger.info(f"🩺 NEW DIAGNOSIS ADDED: Patient {instance.patient.name} | Diagnosis: {instance.diagnosis[:100]}...")
    else:
        logger.info(f"🩺 DIAGNOSIS UPDATED: ID {instance.id} | Patient: {instance.patient.name}")

@receiver(post_delete, sender=Diagnosis)
def log_diagnosis_deletion(sender, instance, **kwargs):
    """
    Log diagnosis deletions.
    """
    logger.info(f"🗑️ DIAGNOSIS DELETED: ID {instance.id} | Patient: {instance.patient.name}")

# Bed Management Audit Logging
@receiver(post_save, sender=Bed)
def log_bed_changes(sender, instance, created, **kwargs):
    """
    Log bed creation and status changes.
    """
    if created:
        logger.info(f"🛏️ NEW BED CREATED: {instance.bed_number} in {instance.ward} | Status: {'Occupied' if instance.is_occupied else 'Available'}")
    else:
        status = 'Occupied' if instance.is_occupied else 'Available'
        patient_info = f" | Patient: {instance.patient.name}" if hasattr(instance, 'patient') and instance.patient else ""
        logger.info(f"🛏️ BED STATUS CHANGED: {instance.bed_number} in {instance.ward} | Status: {status}{patient_info}")

@receiver(post_delete, sender=Bed)
def log_bed_deletion(sender, instance, **kwargs):
    """
    Log bed deletions.
    """
    logger.info(f"🗑️ BED DELETED: {instance.bed_number} in {instance.ward}")