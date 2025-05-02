
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  budget: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Budget must be a positive number" }),
});

type FormValues = z.infer<typeof formSchema>;

interface FormComponentProps {
  onSubmit: (data: FormValues) => void;
  defaultValues?: Partial<FormValues>;
  buttonLabel: string;
}

const FormComponent: React.FC<FormComponentProps> = ({
  onSubmit,
  defaultValues = { name: '', budget: '' },
  buttonLabel,
}) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
    toast({
      title: 'Form submitted',
      description: 'Your form has been submitted successfully.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
};

export default FormComponent;
