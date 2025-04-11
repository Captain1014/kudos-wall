import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AvatarOptions, UserAvatar, UserDocument } from '../types/avatar';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const successAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem;
  
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.colors.background};
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const CustomizationSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
  width: max-content;
`;

const OptionGroup = styled.div`
  flex: 1.2;
  min-width: 100px;
  max-width: 120px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 0.5rem;
  background-color: ${props => props.theme.colors.background};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem auto;
  width: 100%;
  max-width: 400px;
`;

const Button = styled.button<{ $status?: 'idle' | 'saving' | 'saved' | 'error' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => {
    switch (props.$status) {
      case 'saved': return '#4CAF50';
      case 'error': return '#f44336';
      case 'saving': return '#9e9e9e';
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
  cursor: ${props => props.$status === 'saving' ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  animation: ${props => props.$status === 'saved' ? successAnimation : 'none'} 0.5s ease;

  &:hover {
    opacity: ${props => props.$status === 'saving' ? 1 : 0.9};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
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

const generateAvatarUrl = async (options: AvatarOptions) => {
  console.log('[generateAvatarUrl] Input options:', JSON.stringify(options));
  try {
    const response = await fetch('https://api.notion-avatar.com/svg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'image/svg+xml',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate avatar: ${response.status}`);
    }

    const svgBlob = await response.blob();
    const url = URL.createObjectURL(svgBlob);
    console.log('[generateAvatarUrl] Generated URL:', url);
    return url;
  } catch (error) {
    console.error('[generateAvatarUrl] Error generating URL:', error, 'with options:', options);
    return '';
  }
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(() => ({
    face: 7,
    nose: 4,
    mouth: 3,
    eyes: 1,
    eyebrows: 13,
    glasses: 3,
    hair: 20,
    accessories: 0,
    details: 0,
    beard: 0,
    flip: 0,
    color: '#FFFFFF',
    shape: 'none'
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [userData, setUserData] = useState<Partial<UserDocument>>({
    displayName: '',
    email: '',
    bio: '',
    role: '',
    department: '',
  });


  // 테스트용 배지 데이터 생성
  

  // Firebase에서 사용자의 프로필 데이터를 불러옴
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 아바타 옵션 로드
          if (data.avatar?.avatarOptions) {
            const loadedOptions = data.avatar.avatarOptions;
            const defaultOptions = {
              face: 7,
              nose: 4,
              mouth: 3,
              eyes: 1,
              eyebrows: 13,
              glasses: 3,
              hair: 20,
              accessories: 0,
              details: 0,
              beard: 0,
              flip: 0,
              color: '#FFFFFF',
              shape: 'none'
            };

            setAvatarOptions({
              ...defaultOptions,
              ...loadedOptions
            });
          }
          
          // 사용자 데이터 로드
          setUserData({
            displayName: data.displayName || user.displayName || '',
            email: data.email || user.email || '',
            bio: data.bio || '',
            role: data.role || '',
            department: data.department || '',
          });
        } else {
          // 문서가 없는 경우 기본값 설정
          setUserData({
            displayName: user.displayName || '',
            email: user.email || '',
            bio: '',
            role: '',
            department: '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData({
          displayName: user.displayName || '',
          email: user.email || '',
          bio: '',
          role: '',
          department: '',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid, user?.displayName, user?.email]);

  

  const saveUserData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const now = new Date().toISOString();
      
      // 아바타 생성 및 SVG 데이터 가져오기
      const response = await fetch('https://api.notion-avatar.com/svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'image/svg+xml',
        },
        body: JSON.stringify(avatarOptions),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate avatar: ${response.status}`);
      }

      const svgText = await response.text();
      
      const userAvatar: UserAvatar = {
        avatarOptions,
        svgData: svgText, // SVG 데이터 저장
        updatedAt: now,
        createdAt: now
      };
      console.log('Saving user avatar:', userAvatar);

      const userDataToSave = {
        uid: user.uid,
        email: userData.email,
        displayName: userData.displayName,
        bio: userData.bio,
        role: userData.role,
        department: userData.department,
        avatar: userAvatar,
        avatarOptions,
        updatedAt: now,
        createdAt: now
      };
      console.log('Saving user data:', userDataToSave);

      await setDoc(docRef, userDataToSave, { merge: true });

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving user data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptionChange = (option: keyof typeof avatarOptions, value: number | string) => {
    setAvatarOptions((prev: typeof avatarOptions) => ({
      ...prev,
      [option]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRandomAvatar = () => {
    setAvatarOptions({
      face: Math.floor(Math.random() * 10),
      nose: Math.floor(Math.random() * 10),
      mouth: Math.floor(Math.random() * 10),
      eyes: Math.floor(Math.random() * 10),
      eyebrows: Math.floor(Math.random() * 15),
      glasses: Math.floor(Math.random() * 5),
      hair: Math.floor(Math.random() * 30),
      accessories: Math.floor(Math.random() * 5),
      details: Math.floor(Math.random() * 2),
      beard: Math.floor(Math.random() * 2),
      flip: 0,
      color: '#FFFFFF',
      shape: 'none'
    });
  };

  const avatarUrl = generateAvatarUrl(avatarOptions);

  if (isLoading) {
    return (
      <ProfileContainer>
        <Card>
          <ProfileHeader>
            <AvatarSection>
              <AvatarContainer>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'none'
                }}>
                  Loading...
                </div>
              </AvatarContainer>
            </AvatarSection>
          </ProfileHeader>
        </Card>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        ← Back
      </BackButton>
      <Card>
        <ProfileHeader>
          <AvatarSection>
            <AvatarContainer>
              <Avatar 
                src={avatarUrl} 
                alt="Profile Avatar"
                onError={(e) => console.error('Avatar image failed to load:', e, 'URL:', avatarUrl)}
              />
            </AvatarContainer>
            <ButtonGroup>
              <Button onClick={generateRandomAvatar}>
                Random Avatar
              </Button>
              <Button 
                onClick={saveUserData} 
                disabled={isSaving}
                $status={saveStatus}
              >
                {saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'saved' ? 'Saved!' :
                 saveStatus === 'error' ? 'Error!' :
                 'Save Profile'}
              </Button>
            </ButtonGroup>
            
            <CustomizationSection>
              <OptionGroup>
                <Label>Face Style</Label>
                <Select
                  value={avatarOptions.face}
                  onChange={(e) => handleOptionChange('face', parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i}>Face Style {i + 1}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Eyes</Label>
                <Select
                  value={avatarOptions.eyes}
                  onChange={(e) => handleOptionChange('eyes', parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i}>Eyes Style {i + 1}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Nose</Label>
                <Select
                  value={avatarOptions.nose}
                  onChange={(e) => handleOptionChange('nose', parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i}>Nose Style {i + 1}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Mouth</Label>
                <Select
                  value={avatarOptions.mouth}
                  onChange={(e) => handleOptionChange('mouth', parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i}>Mouth Style {i + 1}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Hair Style</Label>
                <Select
                  value={avatarOptions.hair}
                  onChange={(e) => handleOptionChange('hair', parseInt(e.target.value))}
                >
                  {[...Array(30)].map((_, i) => (
                    <option key={i} value={i}>Hair Style {i + 1}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Glasses</Label>
                <Select
                  value={avatarOptions.glasses}
                  onChange={(e) => handleOptionChange('glasses', parseInt(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'None' : `Glasses Style ${i}`}</option>
                  ))}
                </Select>
              </OptionGroup>

              <OptionGroup>
                <Label>Accessories</Label>
                <Select
                  value={avatarOptions.accessories}
                  onChange={(e) => handleOptionChange('accessories', parseInt(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'None' : `Accessory ${i}`}</option>
                  ))}
                </Select>
              </OptionGroup>
            </CustomizationSection>
          </AvatarSection>
          <ProfileInfo>
            <ProfileForm onSubmit={saveUserData}>
              <FormGroup>
                <Label>Display Name</Label>
                <Input
                  type="text"
                  name="displayName"
                  value={userData.displayName}
                  onChange={handleInputChange}
                  placeholder="Your display name"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Role</Label>
                <Input
                  type="text"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  placeholder="Your role (e.g. Frontend Developer)"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Department</Label>
                <Input
                  type="text"
                  name="department"
                  value={userData.department}
                  onChange={handleInputChange}
                  placeholder="Your department"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Bio</Label>
                <TextArea
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </FormGroup>
            </ProfileForm>
          </ProfileInfo>
        </ProfileHeader>
      </Card>
      
                  
    </ProfileContainer>
  );
};

export default Profile;