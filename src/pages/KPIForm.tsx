import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Form = styled.form`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${props => props.theme.colors.primary}20;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const CompletionValue = styled.div`
  min-width: 60px;
  padding: 0.5rem;
  background: ${props => props.theme.colors.primary}10;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.primary}20;
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
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SaveButton = styled(Button)`
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const CancelButton = styled(Button)`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.text};
`;

interface KPIFormData {
  title: string;
  description: string;
  dueDate: string;
  completion: number;
}

const KPIForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<KPIFormData>({
    title: '',
    description: '',
    dueDate: '',
    completion: 0
  });

  useEffect(() => {
    if (isEditing) {
      // TODO: Fetch KPI data by ID
      // For now, using mock data
      const mockData = {
        title: 'Project Delivery Success Rate',
        description: 'Maintain a high success rate for project deliveries within agreed timelines',
        dueDate: '2024-06-30',
        completion: 85
      };
      setFormData(mockData);
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', formData);
    navigate('/kpi');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'completion' ? Number(value) : value
    }));
  };

  return (
    <PageContainer>
      <Header>
        <Title>{isEditing ? 'Edit KPI' : 'Create New KPI'}</Title>
        <BackButton to="/kpi">← Back to KPIs</BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter KPI title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter KPI description"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="completion">Completion</Label>
          <SliderContainer>
            <Slider
              id="completion"
              name="completion"
              type="range"
              min="0"
              max="100"
              value={formData.completion}
              onChange={handleChange}
              required
            />
            <CompletionValue>{formData.completion}%</CompletionValue>
          </SliderContainer>
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate('/kpi')}>
            Cancel
          </CancelButton>
          <SaveButton type="submit">
            {isEditing ? 'Save Changes' : 'Create KPI'}
          </SaveButton>
        </ButtonGroup>
      </Form>
    </PageContainer>
  );
};

export default KPIForm; 