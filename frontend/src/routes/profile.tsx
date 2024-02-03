import { UserProfile, user } from "@/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        dateJoined: "",
        avatar: "",
    });

    const { userId } = useParams();

    useEffect(() => {
        user.get(userId!.replace("@", ""))
            .then((res) => setProfile(res.data))
            .catch((err) => {
                if (err.response) {
                    toast.error("Invalid username");
                    setProfile({
                        username: "404",
                        firstName: "Not",
                        lastName: "Found",
                        email: "error@404.com",
                        bio: "This user could not be found",
                        dateJoined: "Now",
                        avatar: "https://avatars.githubusercontent.com/u/10137",
                    });
                } else {
                    toast.error("Network error");
                }
            });
    }, []);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <div className="flex flex-row justify-between items-center">
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
                    <div className="w-full flex flex-col items-start px-5 space-y-1">
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
        </Card>
    );
};
