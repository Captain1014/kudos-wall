import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getUserKPIs, getAllKudosCards, getTeamMembers } from '../utils/firestore';
import { KPI, KudosCard, User } from '../types/models';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const NavigationBar = styled.nav`
  background: ${props => props.theme.colors.cardBackground};
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ProfilesSection = styled.div`
  
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TeamHeader = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  margin: 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProfileCard = styled(Link)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 0rem;
`;

const Name = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const Role = styled.p`
  color: ${props => props.theme.colors.text}80;
  margin: 0 0 0.5rem 0;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  font-size: 1.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.text}80;
  font-size: 0.875rem;
`;

// Display My profile
const MyProfile = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid ${props => props.theme.colors.primary}20;
  position: relative;
  width: 100%;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2.5rem;
  align-items: start;
`;

const ProfileLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-right: 2.5rem;
  border-right: 1px solid ${props => props.theme.colors.primary}20;
`;

const ProfileMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
`;

const MetricCard = styled(Link)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid ${props => props.theme.colors.primary}10;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const MetricHeader = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ProfileInfo = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
  width: 100%;
`;

const LoadingAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.cardBackground};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingMetricCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid ${props => props.theme.colors.primary}10;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.border},
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    100% {
      left: 200%;
    }
  }
`;

const LoadingStatValue = styled.div`
  height: 24px;
  width: 80px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  
`;

const LoadingStatLabel = styled.div`
  height: 16px;
  width: 120px;
  background: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  opacity: 0.7;
`;

const Button = styled(Link)`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  text-decoration: none;
  transition: background-color 0.2s;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &:hover {
    background: ${props => props.theme.colors.primary}dd;
  }
`;

const ButtonText = styled.span`
  font-weight: 500;
`;

interface DashboardStats {
  kpis: KPI[];
  kudosReceived: KudosCard[];
  kudosGiven: KudosCard[];
  teamMembers: User[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [allKudos, setAllKudos] = useState<KudosCard[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    kpis: [],
    kudosReceived: [],
    kudosGiven: [],
    teamMembers: [],
  });

  // stats 변경을 감지하는 useEffect 추가
  useEffect(() => {
    console.log('Stats updated:', stats);
  }, [stats]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        setAvatarUrl(null);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Starting to load dashboard data...');
        
        // 아바타 로드
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Firebase user data:', data);
          if (data.avatarUrl) {
            console.log('Avatar URL:', data.avatarUrl);
            setAvatarUrl(data.avatarUrl);
          } else {
            // display a button to redirect to profile page
            console.log('No avatar URL found');
          }
          // 사용자 역할 설정
          if (data.role) {
            setUserRole(data.role);
          }
        }

        // KPI 데이터 로드
        console.log('Loading KPIs...');
        let kpis: KPI[] = [];
        try {
          kpis = await getUserKPIs(user.uid);
          console.log('Loaded KPIs:', kpis);
        } catch (error) {
          console.error('Error loading KPIs:', error);
        }
        
        // Kudos 데이터 로드
        console.log('Loading Kudos...');
        let myKudosReceived: KudosCard[] = [];
        let myKudosGiven: KudosCard[] = [];
        
        try {
          // 모든 Kudos 데이터를 가져오도록 수정
          const fetchedKudos = await getAllKudosCards();
          setAllKudos(fetchedKudos);
          console.log('Loaded All Kudos:', fetchedKudos);
          
          // 현재 사용자의 Kudos 필터링
          myKudosReceived = fetchedKudos.filter(k => k.receiverId === user.uid);
          myKudosGiven = fetchedKudos.filter(k => k.senderId === user.displayName);
          console.log('Current User Kudos - Received:', myKudosReceived, 'Given:', myKudosGiven);
        } catch (error) {
          console.error('Error loading Kudos:', error);
        }
        
        // 팀원 데이터 로드
        console.log('Loading team members...');
        let teamMembers: User[] = [];
        try {
          teamMembers = await getTeamMembers();
          console.log('Loaded Team Members:', teamMembers);
        } catch (error) {
          console.error('Error loading team members:', error);
        }

        // 상태 업데이트
        console.log('Preparing to update stats...');
        const newStats = {
          kpis: kpis || [],
          kudosReceived: myKudosReceived,  // 받은 Kudos만 저장
          kudosGiven: myKudosGiven,      // 보낸 Kudos만 저장
          teamMembers: teamMembers || [],
        };
        
        console.log('Setting new stats:', newStats);
        setStats(newStats);
        console.log('Stats update triggered');

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.uid]);

  // 로딩 중일 때 표시할 컴포넌트
  const LoadingDashboard = () => (
    <ProfileContent>
      <ProfileLeft>
        <LoadingAvatar>
          <span>Loading...</span>
        </LoadingAvatar>
        <ProfileInfo>
          <Name>{user?.displayName || ''}</Name>
          <Role>{userRole || ''}</Role>
        </ProfileInfo>
      </ProfileLeft>
      <ProfileMetrics>
        <LoadingMetricCard>
          <MetricHeader>
            <MetricIcon>📊</MetricIcon>
            My KPIs
          </MetricHeader>
          <MetricGrid>
            <StatItem>
              <LoadingStatValue />
              <LoadingStatLabel />
            </StatItem>
            <StatItem>
              <LoadingStatValue />
              <LoadingStatLabel />
            </StatItem>
          </MetricGrid>
        </LoadingMetricCard>
        <LoadingMetricCard>
          <MetricHeader>
            <MetricIcon>🌟</MetricIcon>
            My Kudos
          </MetricHeader>
          <MetricGrid>
            <StatItem>
              <LoadingStatValue />
              <LoadingStatLabel />
            </StatItem>
            <StatItem>
              <LoadingStatValue />
              <LoadingStatLabel />
            </StatItem>
          </MetricGrid>
        </LoadingMetricCard>
      </ProfileMetrics>
    </ProfileContent>
  );

  // 실제 데이터를 표시할 컴포넌트
  const DashboardContent = () => (
    <ProfileContent>
      <ProfileLeft>
        {avatarUrl ? (
          <Avatar 
            src={avatarUrl} 
            alt={user?.displayName || 'My Profile'} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <Button to="/profile">
            <ButtonText>Set Avatar</ButtonText>
          </Button>
        )}
        <ProfileInfo>
          <Name>{user?.displayName || ''}</Name>
          <Role>{userRole || ''}</Role>
        </ProfileInfo>
      </ProfileLeft>
      <ProfileMetrics>
        <MetricCard to="/kpi">
          <MetricHeader>
            <MetricIcon>📊</MetricIcon>
            My KPIs
          </MetricHeader>
          <MetricGrid>
            <StatItem>
              <StatValue>{stats.kpis.length}</StatValue>
              <StatLabel>Total KPIs</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {stats.kpis.length > 0
                  ? Math.round(
                      (stats.kpis.reduce((acc, kpi) => acc + (kpi.current / kpi.target) * 100, 0) /
                        stats.kpis.length)
                    )
                  : 0}%
              </StatValue>
              <StatLabel>Average Progress</StatLabel>
            </StatItem>
          </MetricGrid>
        </MetricCard>
        <MetricCard to="/kudos">
          <MetricHeader>
            <MetricIcon>🌟</MetricIcon>
            My Kudos
          </MetricHeader>
          <MetricGrid>
            <StatItem>
              <StatValue>{stats.kudosReceived.length}</StatValue>
              <StatLabel>Received</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.kudosGiven.length}</StatValue>
              <StatLabel>Given</StatLabel>
            </StatItem>
          </MetricGrid>
        </MetricCard>
      </ProfileMetrics>
    </ProfileContent>
  );

  return (
    <DashboardContainer>
      <NavigationBar>
        <NavLinks>
          <NavLink to="/kudos">Kudos Wall</NavLink>
          <NavLink to="/kpi">KPI Tracking</NavLink>
        </NavLinks>
        <NavLink to="/profile">
          {user?.displayName || 'My Profile'}
        </NavLink>
      </NavigationBar>

      <ProfilesSection>
        <MyProfile>
          {isLoading ? <LoadingDashboard /> : <DashboardContent />}
        </MyProfile>

        <TeamSection>
          <TeamHeader>Team Members</TeamHeader>
          <TeamGrid>
            {isLoading ? (
              // 로딩 중일 때 표시할 컴포넌트
              Array(4).fill(0).map((_, index) => (
                <ProfileCard key={`loading-${index}`} to="#">
                  
                  <Stats>
                    <StatItem>
                      <LoadingStatValue />
                      <LoadingStatLabel />
                    </StatItem>
                    
                  </Stats>
                </ProfileCard>
              ))
            ) : (
              // 실제 데이터를 표시할 컴포넌트
              stats.teamMembers
                .filter(member => member.id !== user?.uid) // 현재 사용자를 제외
                .map(member => (
                  <ProfileCard key={member.id} to={`/other-profile/${member.id}`}>
                    <Avatar 
                      src={member.avatarUrl || '/default-avatar.png'} 
                      alt={member.displayName} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                    <Name>{member.displayName}</Name>
                    <Role>{member.role || 'No Role Specified'}</Role>
                    <Role>{member.email}</Role>
                    <Stats>
                      <StatItem>
                        <StatValue>
                          {allKudos.filter(k => k.receiverId === member.id).length}
                        </StatValue>
                        <StatLabel>Kudos Received</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>
                          {allKudos.filter(k => k.senderId === member.displayName).length}
                        </StatValue>
                        <StatLabel>Kudos Given</StatLabel>
                      </StatItem>
                    </Stats>
                  </ProfileCard>
                ))
            )}
          </TeamGrid>
        </TeamSection>
      </ProfilesSection>
    </DashboardContainer>
  );
};

export default Dashboard; 