from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Doctor, Patient, Bed, Medicine, Diagnosis

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create a doctor user if not exists
        doctor_user, created = User.objects.get_or_create(
            username='doctor1',
            defaults={
                'first_name': 'John',
                'last_name': 'Smith', 
                'role': 'doctor',
                'email': 'doctor@hospital.com'
            }
        )
        if created:
            doctor_user.set_password('password123')
            doctor_user.save()
            self.stdout.write(f'Created doctor user: {doctor_user.username}')

        # Create doctor profile
        doctor, created = Doctor.objects.get_or_create(
            user=doctor_user,
            defaults={
                'specialization': 'Cardiology',
                'contact': '123-456-7890',
                'availability': 'Monday,Tuesday,Wednesday'
            }
        )
        if created:
            self.stdout.write(f'Created doctor profile: Dr. {doctor}')

        # Create beds
        bed1, created = Bed.objects.get_or_create(
            bed_number='101',
            defaults={'ward': 'Ward A', 'is_occupied': True}
        )
        if created:
            self.stdout.write(f'Created bed: {bed1}')

        bed2, created = Bed.objects.get_or_create(
            bed_number='102', 
            defaults={'ward': 'Ward A', 'is_occupied': True}
        )
        if created:
            self.stdout.write(f'Created bed: {bed2}')

        # Create patients
        patient1, created = Patient.objects.get_or_create(
            name='Alice Johnson',
            defaults={
                'age': 45,
                'gender': 'Female',
                'contact': '555-0101',
                'address': '123 Main St, City',
                'emergency_contact': '555-0102',
                'condition': 'Hypertension monitoring',
                'assigned_bed': bed1,
                'assigned_doctor': doctor
            }
        )
        if created:
            self.stdout.write(f'Created patient: {patient1}')

        patient2, created = Patient.objects.get_or_create(
            name='Bob Williams',
            defaults={
                'age': 52,
                'gender': 'Male', 
                'contact': '555-0201',
                'address': '456 Oak Ave, City',
                'emergency_contact': '555-0202',
                'condition': 'Post-surgery recovery',
                'assigned_bed': bed2,
                'assigned_doctor': doctor
            }
        )
        if created:
            self.stdout.write(f'Created patient: {patient2}')

        # Create sample medicines
        medicine1, created = Medicine.objects.get_or_create(
            patient=patient1,
            medicine_name='Lisinopril',
            defaults={
                'dosage': '10mg',
                'frequency': 'Breakfast,Dinner',
                'relation_to_food': 'After',
                'no_of_days': 30
            }
        )
        if created:
            self.stdout.write(f'Created medicine: {medicine1}')

        medicine2, created = Medicine.objects.get_or_create(
            patient=patient2,
            medicine_name='Ibuprofen',
            defaults={
                'dosage': '400mg',
                'frequency': 'Breakfast,Lunch,Dinner',
                'relation_to_food': 'After',
                'no_of_days': 7
            }
        )
        if created:
            self.stdout.write(f'Created medicine: {medicine2}')

        # Create sample diagnoses
        diagnosis1, created = Diagnosis.objects.get_or_create(
            patient=patient1,
            diagnosis='Essential hypertension. Patient responding well to medication. Blood pressure stable.',
            defaults={}
        )
        if created:
            self.stdout.write(f'Created diagnosis: {diagnosis1}')

        diagnosis2, created = Diagnosis.objects.get_or_create(
            patient=patient2,
            diagnosis='Post-operative recovery from appendectomy. Healing well, no complications.',
            defaults={}
        )
        if created:
            self.stdout.write(f'Created diagnosis: {diagnosis2}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write('You can now login with: username=doctor1, password=password123')