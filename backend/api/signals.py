# api/signals.py
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import CustomUser, Doctor, Patient, Bed

@receiver(post_save, sender=CustomUser)
def create_doctor_profile(sender, instance, created, **kwargs):
    """
    Automatically create a Doctor profile when a CustomUser with the 'doctor' role is created.
    """
    if created and instance.role == 'doctor':
        Doctor.objects.create(user=instance)

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
    
    # If old bed exists and is different from new bed, mark it as unoccupied
    if old_bed and old_bed != new_bed:
        old_bed.is_occupied = False
        old_bed.save()
    
    # If new bed exists, mark it as occupied
    if new_bed:
        new_bed.is_occupied = True
        new_bed.save()

@receiver(post_delete, sender=Patient)
def update_bed_occupancy_on_patient_delete(sender, instance, **kwargs):
    """
    Mark bed as unoccupied when patient is deleted.
    """
    if instance.assigned_bed:
        instance.assigned_bed.is_occupied = False
        instance.assigned_bed.save()