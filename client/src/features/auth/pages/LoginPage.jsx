import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
export default function LoginPage() {
 const navigate = useNavigate(); const { login } = useAuth(); const mutation = useLogin();
 const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
 const submit = values => mutation.mutate(values, { onSuccess: result => {
   login(result); toast.success('Welcome back'); navigate(result.user.role === 'ADMIN' ? '/admin' : '/barber');
 }, onError: error => toast.error(error.response?.data?.message || 'Unable to login. Please retry.') });
 return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 p-4"><form className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-6 shadow-lg sm:p-8" onSubmit={handleSubmit(submit)}>
 <h1 className="text-3xl font-bold">Staff Login</h1><p className="text-slate-600">Sign in to BarberQueue.</p>
 <Input label="Email" type="email" autoComplete="username" {...register('email')} error={errors.email?.message} />
 <Input label="Password" type="password" autoComplete="current-password" {...register('password')} error={errors.password?.message} />
 <Button className="w-full" type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Logging in…' : 'Login'}</Button>
 <Link className="block text-center text-indigo-700" to="/customer">Browse Barbers</Link></form></main>;
}
