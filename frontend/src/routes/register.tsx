import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { auth } from "@/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ROUTES } from "./routes";

const formSchema = z
    .object({
        avatar: z.custom<File>().optional(),
        username: z
            .string()
            .min(4)
            .max(150)
            .regex(/^[A-Za-z._-][A-Za-z0-9._-]+$/g),
        firstName: z.string().min(4).max(150),
        lastName: z.string().min(4).max(150),
        email: z.string().min(4).email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        bio: z.string().min(10).max(255),
    })
    .superRefine(({ confirmPassword, password, avatar }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }

        if (typeof avatar !== "undefined" && avatar.size >= 1024 * 1024) {
            ctx.addIssue({
                code: "too_big",
                path: ["avatar"],
                type: "number",
                maximum: 1024 * 1024,
                inclusive: true,
                message: "Size is too large",
            });
        }
    });

export const Register: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            bio: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(values)) {
            if (typeof value !== "undefined")
                formData.append(
                    key.replace(/([A-Z])/g, "_$1").toLowerCase(),
                    value,
                );
        }

        toast.promise(auth.register(formData), {
            loading: "Logging in...",
            success: () => {
                navigate(ROUTES.login);

                return "Registered successfully";
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
                <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            onChange={(e) => {
                                                field.onChange(
                                                    e.target.files
                                                        ? e.target.files[0]
                                                        : null,
                                                );
                                            }}
                                            type="file"
                                            accept="image/*"
                                            className="file:text-foreground"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Username"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Password"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                                                {showPassword ? (
                                                    <Eye
                                                        size={18}
                                                        strokeWidth={1.5}
                                                        onClick={() =>
                                                            setShowPassword(
                                                                false,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOff
                                                        size={18}
                                                        strokeWidth={1.5}
                                                        onClick={() =>
                                                            setShowPassword(
                                                                true,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm Password"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                                                {showConfirmPassword ? (
                                                    <Eye
                                                        size={18}
                                                        strokeWidth={1.5}
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                false,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOff
                                                        size={18}
                                                        strokeWidth={1.5}
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                true,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
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

                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <CardDescription>
                    Already have an account?{" "}
                    <Link to={ROUTES.login}>Login</Link>
                </CardDescription>
            </CardFooter>
        </Card>
    );
};
