from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from user.models import User


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(
                {"detail": f"Couldn't logout: {e}"}, status=status.HTTP_400_BAD_REQUEST
            )


class RegisterView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request: Request):
        try:
            print(type(request.data))
            user = User(
                username=request.data["username"],
                email=request.data["email"],
                first_name=request.data["first_name"],
                last_name=request.data["last_name"],
                avatar=request.data["avatar"],
                bio=request.data["bio"],
            )
            user.set_password(request.data["password"])
            user.save()
        except Exception as e:
            return Response(
                {"detail": f"could not create user: {e}"},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_201_CREATED)
