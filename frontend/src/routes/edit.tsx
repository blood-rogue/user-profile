import { user } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { z } from "zod";
import { ROUTES, STORAGE_KEYS } from "./routes";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from "axios";

const formSchema = z.object({
    firstName: z.string().min(4).max(150),
    lastName: z.string().min(4).max(150),
    email: z.string().min(4).email(),
    bio: z.string().min(10).max(255),
});

export const Edit: React.FC = () => {
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            bio: "",
        },
    });

    useEffect(() => {
        const access = localStorage.getItem(STORAGE_KEYS.access);
        if (access) {
            const userId = JSON.parse(atob(access.split(".")[1]))["user_id"];
            setId(userId);
            user.get(userId)
                .then((res) => res.data)
                .then((data) => {
                    form.setValue("firstName", data.firstName);
                    form.setValue("lastName", data.lastName);
                    form.setValue("email", data.email);
                    form.setValue("bio", data.bio);
                });
        } else {
            navigate(ROUTES.login);
        }
    }, [form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.promise(user.edit(id, values), {
            loading: "Updating profile data...",
            success: () => {
                navigate("/");
                return "Successfully updated profile data";
            },
            error: (err: AxiosError<{ detail: string }>) => {
                if (err.response) {
                    return err.response.data.detail;
                } else {
                    return "Network error";
                }
            },
        });
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Edit</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="First Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Last Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Email"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Bio"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Update Profile</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
