import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { createKPI } from '../utils/firestore';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0 0 2rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const FormGroupHalf = styled(FormGroup)`
  width: 50%;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => 
    props.variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.theme.colors.primary};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

interface KPIFormData {
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
}

const KPICreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<KPIFormData>({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target' || name === 'current' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSubmitting(true);
    try {
      await createKPI({
        userId: user.uid,
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      navigate('/kpi');
    } catch (error) {
      console.error('Error creating KPI:', error);
      alert('Failed to create KPI. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Create New KPI</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete Project Tasks"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your KPI in detail..."
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroupHalf>
              <Label>Target Value</Label>
              <Input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </FormGroupHalf>

            <FormGroupHalf>
              <Label>Current Value</Label>
              <Input
                type="number"
                name="current"
                value={formData.current}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </FormGroupHalf>
          </FormRow>

          <FormGroup>
            <Label>Unit</Label>
            <Input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., tasks, percent, hours"
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroupHalf>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormGroupHalf>

            <FormGroupHalf>
              <Label>End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </FormGroupHalf>
          </FormRow>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={() => navigate('/kpi')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create KPI'}
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default KPICreate; 