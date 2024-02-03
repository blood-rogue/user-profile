import hashlib
import os
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from PIL import Image


def get_avatar_path(instance, filename: str):
    ext = filename.split(".")[1]
    return f"avatars/{hashlib.md5(instance.id.bytes).hexdigest()}.{ext}"


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to=get_avatar_path)
    bio = models.CharField(max_length=255)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        os.remove(self.avatar.path)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        img = Image.open(self.avatar.path)
        width, height = img.size

        if width > 300 and height > 300:
            img.thumbnail((width, height))

        if height < width:
            left = (width - height) / 2
            right = (width + height) / 2
            top = 0
            bottom = height
            img = img.crop((left, top, right, bottom))

        elif width < height:
            left = 0
            right = width
            top = 0
            bottom = width
            img = img.crop((left, top, right, bottom))

        if width > 300 and height > 300:
            img.thumbnail((300, 300))

        img.save(self.avatar.path)
