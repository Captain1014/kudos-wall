import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface CreateKudosFormProps {
  onSubmit: (kudos: {
    to: string;
    message: string;
    category: string;
  }) => void;
}

const Form = styled(motion.form)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const CreateKudosForm: React.FC<CreateKudosFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    to: '',
    message: '',
    category: 'teamwork'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ to: '', message: '', category: 'teamwork' });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        type="text"
        placeholder="To (recipient's name)"
        value={form.to}
        onChange={e => setForm({ ...form, to: e.target.value })}
        required
      />
      <Select
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      >
        <option value="teamwork">Teamwork</option>
        <option value="innovation">Innovation</option>
        <option value="leadership">Leadership</option>
        <option value="achievement">Achievement</option>
      </Select>
      <TextArea
        placeholder="Write your kudos message..."
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        required
      />
      <Button type="submit">Send Kudos</Button>
    </Form>
  );
};

export default CreateKudosForm; 