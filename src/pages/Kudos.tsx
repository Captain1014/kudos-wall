import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserKudosCards, getTeamMembers, createKudosCard, getAllKudosCards } from '../utils/firestore';
import { KudosCard as KudosCardType, User } from '../types/models';
import { format } from 'date-fns';
import { checkAndAwardBadges } from '../utils/badges';
import { toast } from 'react-hot-toast';

const PageContainer = styled.div`
  background: ${props => props.theme.colors.background};
  max-width: 1200px;
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
  margin-left: auto;
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.cardBackground};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primary}10;
  }
`;

const KudosList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const KudoCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const KudoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const Date = styled.div`
  color: ${props => props.theme.colors.text}80;
  font-size: 0.9rem;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.5;
`;

const GiveKudoSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  width: 100%;
  max-width: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: none;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelect = styled.div`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  position: relative;
  user-select: none;
`;

const DropdownList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem;
  cursor: pointer;
  background-color: ${props => props.isSelected ? props.theme.colors.primary + '20' : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
  }
`;

const SelectArrow = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) rotate(${props => props.isOpen ? '180deg' : '0'});
  transition: transform 0.2s;
  pointer-events: none;
  color: ${props => props.theme.colors.text};
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.primary}20;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text}80;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: 1rem;
  background: ${props => props.theme.colors.error}10;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 1rem;
`;

const Kudos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'received' | 'give'>('received');
  const [receivedKudos, setReceivedKudos] = useState<KudosCardType[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 받은 Kudos 로드
        const kudos = await getUserKudosCards(user.uid);
        setReceivedKudos(kudos);
        
        // 팀원 데이터 로드
        const members = await getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !selectedUser || !message || !category) return;

    try {
      setIsSubmitting(true);
      
      // Kudos 카드 생성
      await createKudosCard({
        senderId: user.uid,
        receiverId: selectedUser.id,
        message,
        category,
      });

      // 모든 Kudos 데이터를 가져와서 배지 체크
      const allKudos = await getAllKudosCards();
      
      // 보낸 사람과 받은 사람 모두의 배지를 체크
      const [senderBadges] = await Promise.all([
        checkAndAwardBadges(user.uid, allKudos),
        checkAndAwardBadges(selectedUser.id, allKudos), // 받는 사람의 배지도 체크하지만 결과는 사용하지 않음
      ]);

      // 새로운 배지를 획득했다면 알림
      if (senderBadges.length > 0) {
        toast.success(`Congratulations! You've earned new badges: ${senderBadges.map(b => b.name).join(', ')}`);
      }

      toast.success('Kudos sent successfully!');
      setMessage('');
      setSelectedUser(null);
      setCategory('general');
      
    } catch (error) {
      console.error('Error creating kudos:', error);
      toast.error('Error while sending Kudos. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <Title>Kudos Wall</Title>
          <BackButton onClick={() => navigate('/dashboard')}>← Back</BackButton>
        </Header>
        <LoadingSpinner>Loading...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Kudos Wall</Title>
        <BackButton onClick={() => navigate('/dashboard')}>← Back</BackButton>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'received'} 
          onClick={() => setActiveTab('received')}
        >
          Received Kudos
        </Tab>
        <Tab 
          active={activeTab === 'give'} 
          onClick={() => setActiveTab('give')}
        >
          Give Kudos
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {activeTab === 'received' ? (
        <KudosList>
          {receivedKudos.length === 0 ? (
            <KudoCard>
              <Message>No kudos received yet.</Message>
            </KudoCard>
          ) : (
            receivedKudos.map(kudo => {
              const sender = teamMembers.find(member => member.id === kudo.senderId || member.displayName === kudo.senderId);
              console.log("This is sender",sender);
              console.log("This is member",teamMembers);
              return (
                <KudoCard key={kudo.id}>
                  <KudoHeader>
                    <UserInfo>
                      <Avatar 
                        src={sender?.avatarUrl || '/default-avatar.png'} 
                        alt={sender?.displayName || 'Unknown User'} 
                      />
                      <UserName>{sender?.displayName || 'Unknown User'}</UserName>
                    </UserInfo>
                    <Date>{format(kudo.createdAt, 'MMM d, yyyy')}</Date>
                  </KudoHeader>
                  <Message>{kudo.message}</Message>
                </KudoCard>
              );
            })
          )}
        </KudosList>
      ) : (
        <GiveKudoSection>
          <Form onSubmit={handleSubmit}>
            <SelectContainer>
              <CustomSelect onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {selectedMember ? 
                  teamMembers.find(member => member.id === selectedMember)?.displayName 
                  : 'Select team member'}
                <SelectArrow isOpen={isDropdownOpen}>▼</SelectArrow>
              </CustomSelect>
              <DropdownList isOpen={isDropdownOpen}>
                {teamMembers
                  .filter(member => member.id !== user?.uid)
                  .map(member => (
                    <DropdownItem
                      key={member.id}
                      isSelected={member.id === selectedMember}
                      onClick={() => {
                        setSelectedMember(member.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {member.displayName}
                    </DropdownItem>
                  ))
                }
              </DropdownList>
            </SelectContainer>
            <TextArea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your kudos message here..."
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Kudos'}
            </Button>
          </Form>
        </GiveKudoSection>
      )}
    </PageContainer>
  );
};

export default Kudos; 