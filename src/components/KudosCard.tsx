import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface KudosCardProps {
  from: string;
  to: string;
  message: string;
  category: string;
  createdAt: Date;
}

const Card = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Category = styled.span`
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 0.875rem;
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
  margin: 1rem 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.text}80;
  font-size: 0.875rem;
`;

const KudosCard: React.FC<KudosCardProps> = ({
  from,
  to,
  message,
  category,
  createdAt
}) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Category>{category}</Category>
        <span>{createdAt.toLocaleDateString()}</span>
      </Header>
      <Message>{message}</Message>
      <Footer>
        <span>From: {from}</span>
        <span>To: {to}</span>
      </Footer>
    </Card>
  );
};

export default KudosCard; 