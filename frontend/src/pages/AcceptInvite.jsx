import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // User is logged in, redirect to dashboard with invite token
      navigate(`/dashboard?invite=${token}`);
    }
  }, [user, token, navigate]);

  // If not logged in, show login/register options
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-2xl font-bold mb-4">Team Invitation</h2>
        <p className="text-gray-600 mb-6">
          You've been invited to join a team!
        </p>
        <p className="text-gray-700 mb-6 font-semibold">
          Please login or register to accept this invitation.
        </p>
        <div className="space-y-3">
          <Link 
            to={`/login?redirect=/dashboard?invite=${token}`}
            className="btn-primary w-full block"
          >
            Login to Accept
          </Link>
          <Link 
            to={`/register?redirect=/dashboard?invite=${token}`}
            className="btn-secondary w-full block"
          >
            Register to Accept
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          After logging in, you'll automatically join the team!
        </p>
      </div>
    </div>
  );
};

export default AcceptInvite;
