# api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Doctor

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