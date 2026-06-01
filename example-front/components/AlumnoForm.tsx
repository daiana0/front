import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { alumnoSchema } from '../dto/alumno.schema';
import type { AlumnoFormData } from '../dto/alumno.schema';
import type { AlumnoResponse } from '../dto/alumno.dto';

interface AlumnoFormProps {
  initialData?: AlumnoResponse | null;
  onSubmit: (data: AlumnoFormData) => Promise<void>;
  onCancel: () => void;
}

export const AlumnoForm: React.FC<AlumnoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlumnoFormData>({
    resolver: zodResolver(alumnoSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      matricula: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        email: initialData.email,
        matricula: initialData.matricula
      });
    } else {
      reset({
        nombre: '',
        apellido: '',
        email: '',
        matricula: ''
      });
    }
  }, [initialData, reset]);

  return (
    <Paper className="p-6">
      <Typography variant="h6" className="mb-4">
        {initialData ? 'Editar Alumno' : 'Nuevo Alumno'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre"
          {...register('nombre')}
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Apellido"
          {...register('apellido')}
          error={!!errors.apellido}
          helperText={errors.apellido?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Matrícula"
          {...register('matricula')}
          error={!!errors.matricula}
          helperText={errors.matricula?.message}
        />
        <Box className="mt-4 flex justify-end gap-2">
          <Button variant="outlined" color="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
