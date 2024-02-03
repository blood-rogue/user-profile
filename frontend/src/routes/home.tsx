import { AxiosError } from "axios";
import { CalendarIcon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { UserProfile, auth, user } from "@/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { ROUTES, STORAGE_KEYS } from "./routes";

export const Home: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        dateJoined: "",
        avatar: "",
    });

    const [id, setId] = useState("");

    const navigate = useNavigate();

    const handleDeleteClick = () => {
        toast.promise(
            auth.logout().then(() => user.del(id)),
            {
                loading: "Deleting user",
                error: (err: AxiosError<{ detail: string }>) => {
                    if (err.response) {
                        return err.response.data.detail;
                    } else {
                        return "Network error";
                    }
                },
                success: () => {
                    localStorage.removeItem(STORAGE_KEYS.access);
                    localStorage.removeItem(STORAGE_KEYS.refresh);
                    navigate(ROUTES.login);

                    return "Deleted account successfully";
                },
            },
        );
    };

    useEffect(() => {
        const access = localStorage.getItem(STORAGE_KEYS.access);
        if (access) {
            const userId = JSON.parse(atob(access.split(".")[1]))["user_id"];
            setId(userId);
            user.get(userId)
                .then((res) => setProfile(res.data))
                .catch(() => {
                    localStorage.removeItem(STORAGE_KEYS.access);
                    localStorage.removeItem(STORAGE_KEYS.refresh);
                    toast.error("Could not authenticate user");
                    navigate(ROUTES.login);
                });
        } else {
            navigate(ROUTES.login);
        }
    }, []);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <div className="flex flex-row items-center justify-between">
                    <Avatar className="size-14">
                        <AvatarImage
                            src={profile.avatar}
                            alt={`@${profile.username}`}
                        />
                        <AvatarFallback>
                            {`${profile.firstName
                                .charAt(0)
                                .toUpperCase()} ${profile.lastName
                                .charAt(0)
                                .toUpperCase()}`}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex w-full flex-col items-start space-y-1 px-5">
                        <CardTitle>{`${profile.firstName} ${profile.lastName}`}</CardTitle>
                        <CardDescription>@{profile.username}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div>
                    <div className="flex flex-row space-x-2 py-1">
                        <MailIcon strokeWidth={1} size={18} />
                        <CardDescription>{profile.email}</CardDescription>
                    </div>
                    <div className="flex flex-row space-x-2 py-1">
                        <CalendarIcon strokeWidth={1} size={18} />
                        <CardDescription>{profile.dateJoined}</CardDescription>
                    </div>
                </div>
                <div>{profile.bio}</div>
            </CardContent>
            <CardFooter>
                <div className="flex w-full flex-row justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteClick}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button asChild variant="outline">
                        <Link to={ROUTES.edit}>Edit</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to={ROUTES.logout}>Logout</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
