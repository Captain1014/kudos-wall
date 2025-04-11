// Display the user's given Kudos and KPI (read only)

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { getUserById, getUserKPIs, getUserKudosCards, getTeamMembers } from '../utils/firestore';
import { User, KPI } from '../types/models';
import type { KudosCard as KudosCardType } from '../types/models';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ProfileContainer = styled.div`
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  background: ${props => props.theme.colors.cardBackground};
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
  overflow: visible;
  white-space: normal;
  word-break: break-word;
  width: 100%;
`;

const Email = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textLight};
`;

const Role = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.textLight};
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const KPISection = styled.div`
  margin-bottom: 3rem;
`;

const KPICard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const KPITitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
`;

const KPIProgress = styled.div`
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const KPIProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const KPIStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
`;

const KudosSection = styled.div`
  margin-bottom: 3rem;
`;

const KudosCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const KudosContent = styled.p`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text};
`;

const KudosMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  padding: 2rem;
`;

const OtherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [kudos, setKudos] = useState<KudosCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loadProfileData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Loading profile data for user ID:', id);
        
        // 먼저 모든 팀원을 가져와서 해당 ID가 유효한지 확인
        const allTeamMembers = await getTeamMembers();
        console.log('All team members:', allTeamMembers);
        setTeamMembers(allTeamMembers);
        
        const userExists = allTeamMembers.some(member => member.id === id);
        console.log('User exists in team members:', userExists);
        
        if (!userExists) {
          setError('User not found. Invalid user ID.');
          setIsLoading(false);
          return;
        }
        
        // 사용자 정보 로드
        const userData = await getUserById(id);
        console.log('User data loaded:', userData);
        
        if (!userData) {
          setError('User not found.');
          setIsLoading(false);
          return;
        }
        setProfile(userData);
        
        // KPI 데이터 로드
        const kpiData = await getUserKPIs(id);
        console.log('KPI data loaded:', kpiData);
        setKPIs(kpiData);
        
        // Kudos 데이터 로드
        const kudosData = await getUserKudosCards(id);
        console.log('Kudos data loaded:', kudosData);
        setKudos(kudosData);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('An error occurred while loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [id]);

  // Helper function to get sender display name
  const getSenderDisplayName = (senderId: string) => {
    // First check if senderId is a display name (from Kudos.tsx)
    if (teamMembers.some(member => member.displayName === senderId)) {
      return senderId;
    }
    
    // Otherwise, look up the user by ID
    const sender = teamMembers.find(member => member.id === senderId);
    return sender ? sender.displayName : senderId;
  };

  if (isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!profile) {
    return <ErrorMessage>User not found.</ErrorMessage>;
  }

  return (
    <ProfileContainer>
      <Header>
        <Title>User Profile</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          <ArrowLeftIcon width={20} height={20} />
          Back
        </BackButton>
      </Header>
      
      <ProfileHeader>
        <Avatar 
          src={profile.avatarUrl || '/default-avatar.png'} 
          alt={profile.displayName} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-avatar.png';
          }}
        />
        <ProfileInfo>
          <Name>{profile.displayName}</Name>
          <Role>{profile.role || 'No role specified'}</Role>
          <Email>{profile.email}</Email>
        </ProfileInfo>
      </ProfileHeader>

      <KPISection>
        <SectionTitle>KPI</SectionTitle>
        {kpis.length === 0 ? (
          <KPICard>No KPIs available.</KPICard>
        ) : (
          kpis.map(kpi => (
            <KPICard key={kpi.id}>
              <KPITitle>{kpi.title}</KPITitle>
              <KPIProgress>
                <KPIProgressBar progress={Math.min((kpi.current / kpi.target) * 100, 100)} />
              </KPIProgress>
              <KPIStats>
                <span>Current: {kpi.current}</span>
                <span>Target: {kpi.target}</span>
                <span>Progress: {Math.round((kpi.current / kpi.target) * 100)}%</span>
              </KPIStats>
            </KPICard>
          ))
        )}
      </KPISection>

      <KudosSection>
        <SectionTitle>Received Kudos</SectionTitle>
        {kudos.length === 0 ? (
          <KudosCard>No Kudos received.</KudosCard>
        ) : (
          kudos.map(kudo => (
            <KudosCard key={kudo.id}>
              <KudosContent>{kudo.message}</KudosContent>
              <KudosMeta>
                <span>From: {getSenderDisplayName(kudo.senderId)}</span>
                <span>{new Date(kudo.createdAt).toLocaleDateString()}</span>
              </KudosMeta>
            </KudosCard>
          ))
        )}
      </KudosSection>
    </ProfileContainer>
  );
};

export default OtherProfile;
