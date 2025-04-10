import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const excelFileSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file?.type === 'application/vnd.ms-excel', {
      message: 'Only Excel files are allowed',
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    }),
});

type ExcelFormValues = z.infer<typeof excelFileSchema>;

interface ExcelUploadFormProps {
  onUpload: (file: File) => void;
}

export function ExcelUploadForm({ onUpload }: ExcelUploadFormProps) {
  const form = useForm<ExcelFormValues>({
    resolver: zodResolver(excelFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = (data: ExcelFormValues) => {
    onUpload(data.file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Excel File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Upload</Button>
      </form>
    </Form>
  );
} 