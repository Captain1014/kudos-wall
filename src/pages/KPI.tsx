import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserKPIs, updateKPI, deleteKPI } from '../utils/firestore';
import { KPI } from '../types/models';
// import { format } from 'date-fns';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: none;
  
  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const KPICard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 1.8rem;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(138, 43, 226, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const KPITitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const KPIDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
`;

// const KPIProgress = styled.div`
//   margin-bottom: 1.5rem;
// `;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    transition: width 0.5s ease;
  }
`;

// const KPIStats = styled.div`
//   display: flex;
//   justify-content: space-between;
//   font-size: 0.95rem;
//   color: ${props => props.theme.colors.textLight};
//   margin-bottom: 1.5rem;
//   padding: 1rem;
//   background-color: rgba(255, 255, 255, 0.05);
//   border-radius: ${props => props.theme.borderRadius.medium};
//   border: 1px solid ${props => props.theme.colors.border};
// `;

// const KPIDates = styled.div`
//   font-size: 0.85rem;
//   color: ${props => props.theme.colors.textLight};
//   margin-top: 1rem;
//   padding-top: 1rem;
//   border-top: 1px solid ${props => props.theme.colors.border};
//   display: flex;
//   justify-content: space-between;
// `;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px dashed ${props => props.theme.colors.border};
  margin-top: 2rem;
  width: 100%;
  
  p {
    color: ${props => props.theme.colors.textLight};
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${props => props.variant === 'edit' && `
    background: ${props.theme.colors.primary}20;
    color: ${props.theme.colors.primary};
    &:hover {
      background: ${props.theme.colors.primary}30;
    }
  `}

  ${props => props.variant === 'delete' && `
    background: ${props.theme.colors.error}20;
    color: ${props.theme.colors.error};
    &:hover {
      background: ${props.theme.colors.error}30;
    }
  `}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.large};
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const ProgressContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease, background-color 0.3s ease;
`;

const ProgressValues = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-top: 0.5rem;
`;

const KPIPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadKPIs = async () => {
      if (!user?.uid) return;
      
      try {
        const userKPIs = await getUserKPIs(user.uid);
        setKpis(userKPIs);
      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKPIs();
  }, [user?.uid]);

  const handleEdit = (kpi: KPI) => {
    setEditingKPI(kpi);
    setIsModalOpen(true);
  };

  const handleDelete = async (kpiId: string) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      try {
        await deleteKPI(kpiId);
        setKpis(kpis.filter(kpi => kpi.id !== kpiId));
      } catch (error) {
        console.error('Error deleting KPI:', error);
        alert('Failed to delete KPI. Please try again.');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKPI) return;

    try {
      const updatedKPI = await updateKPI(editingKPI.id, {
        title: editingKPI.title,
        description: editingKPI.description,
        current: editingKPI.current,
        target: editingKPI.target,
        unit: editingKPI.unit,
        startDate: editingKPI.startDate,
        endDate: editingKPI.endDate,
      });

      setKpis(kpis.map(kpi => 
        kpi.id === updatedKPI.id ? updatedKPI : kpi
      ));
      setIsModalOpen(false);
      setEditingKPI(null);
    } catch (error) {
      console.error('Error updating KPI:', error);
      alert('Failed to update KPI. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>
            Loading your KPIs...
            <br />
            Please wait a moment
          </LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          ← Back
        </BackButton>
        <Title>Your KPIs</Title>
        <Button onClick={() => navigate('/kpi/new')}>Create New KPI</Button>
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>
            Loading your KPIs...
            <br />
            Please wait a moment
          </LoadingText>
        </LoadingContainer>
      ) : kpis.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <EmptyTitle>No KPIs Yet</EmptyTitle>
          <EmptyText>
            Start tracking your performance by creating your first KPI.
          </EmptyText>
          
        </EmptyState>
      ) : (
        <KPIGrid>
          {kpis.map(kpi => (
            <KPICard key={kpi.id}>
              <KPITitle>{kpi.title}</KPITitle>
              <KPIDescription>{kpi.description}</KPIDescription>
              <ProgressContainer>
                <ProgressLabel>
                  <span>Progress</span>
                  <span>{Math.round((kpi.current / kpi.target) * 100)}%</span>
                </ProgressLabel>
                <ProgressBar progress={Math.min((kpi.current / kpi.target) * 100, 100)}>
                  <ProgressFill
                    style={{
                      width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`,
                      backgroundColor: kpi.current >= kpi.target
                        ? '#4CAF50'
                        : kpi.current >= kpi.target * 0.8
                          ? '#FFC107'
                          : '#F44336'
                    }}
                  />
                </ProgressBar>
                <ProgressValues>
                  <span>{kpi.current} {kpi.unit}</span>
                  <span>Target: {kpi.target} {kpi.unit}</span>
                </ProgressValues>
              </ProgressContainer>
              <CardActions>
                <ActionButton 
                  variant="edit"
                  onClick={() => handleEdit(kpi)}
                >
                  Edit
                </ActionButton>
                <ActionButton 
                  variant="delete"
                  onClick={() => handleDelete(kpi.id)}
                >
                  Delete
                </ActionButton>
              </CardActions>
            </KPICard>
          ))}
        </KPIGrid>
      )}

      {isModalOpen && editingKPI && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit KPI</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleUpdate}>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={editingKPI.title}
                  onChange={e => setEditingKPI({ ...editingKPI, title: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={editingKPI.description}
                  onChange={e => setEditingKPI({ ...editingKPI, description: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup style={{display: 'flex', gap: '1rem'}}>
              <FormGroup style={{width: '50%'}}>
                <Label>Current Value</Label>
                <Input
                  type="number"
                  value={editingKPI.current}
                  onChange={e => setEditingKPI({ ...editingKPI, current: Number(e.target.value) })}
                  required
                />
              </FormGroup>
              <FormGroup style={{width: '50%'}}>
                <Label>Target Value</Label>
                <Input
                  type="number"
                  value={editingKPI.target}
                  onChange={e => setEditingKPI({ ...editingKPI, target: Number(e.target.value) })}
                  required
                />
              </FormGroup>
              </FormGroup>
              
              <FormGroup>
                <Label>Unit</Label>
                <Input
                  type="text"
                  value={editingKPI.unit}
                  onChange={e => setEditingKPI({ ...editingKPI, unit: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup style={{display: 'flex', gap: '1rem'}}>

              <FormGroup style={{width: '50%'}}>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={editingKPI.startDate.toISOString().split('T')[0]}
                  onChange={e => setEditingKPI({ ...editingKPI, startDate: new Date(e.target.value) })}
                  required
                />
              </FormGroup>
              <FormGroup style={{width: '50%'}}>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={editingKPI.endDate.toISOString().split('T')[0]}
                  onChange={e => setEditingKPI({ ...editingKPI, endDate: new Date(e.target.value) })}
                  required
                />
              </FormGroup>
              </FormGroup>
              <ModalActions>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default KPIPage; 