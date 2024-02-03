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
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES, STORAGE_KEYS } from "./routes";

const formSchema = z.object({
    username: z.string().min(4).max(150),
    password: z.string().min(8).max(150),
});

export const Login: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        toast.promise(
            auth.login(values).then((res) => res.data),
            {
                loading: "Logging in...",
                success: (data) => {
                    localStorage.setItem(STORAGE_KEYS.access, data.access);
                    localStorage.setItem(STORAGE_KEYS.refresh, data.refresh);

                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${data.access}`;

                    navigate(ROUTES.profile);

                    return "Loggedin successfully";
                },
                error: (err: AxiosError<{ detail: string }>) => {
                    if (err.response) {
                        return err.response.data.detail;
                    } else {
                        return "Network error";
                    }
                },
            }
        );
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Login</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <CardDescription>
                    Don't have an account?{" "}
                    <Link to={ROUTES.register}>Register</Link>
                </CardDescription>
            </CardFooter>
        </Card>
    );
};
