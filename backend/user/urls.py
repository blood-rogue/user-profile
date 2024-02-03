from django.urls import path

from .views import UserViewset

user_detail = UserViewset.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

urlpatterns = [
    path("user/<str:username>", user_detail, name="user-detail"),
]
