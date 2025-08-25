import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/database';
import User from '../../../lib/models/User';
import { verifyToken } from '../../../lib/middleware/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    await connectDB();

    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Toggle privacy status
    const newPrivacyStatus = !user.isPrivate;
    
    // Update user privacy
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { isPrivate: newPrivacyStatus },
      { new: true, runValidators: true }
    );

    // Check if update was successful
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user privacy'
      });
    }

    res.json({
      success: true,
      message: `Account is now ${newPrivacyStatus ? 'private' : 'public'}`,
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          fullName: updatedUser.fullName,
          isPrivate: updatedUser.isPrivate,
          followersCount: updatedUser.followersCount,
          followingCount: updatedUser.followingCount
        },
        privacyChanged: {
          previousStatus: user.isPrivate,
          newStatus: updatedUser.isPrivate,
          message: newPrivacyStatus 
            ? 'Your account is now private. Only approved followers can see your posts and profile.'
            : 'Your account is now public. Anyone can see your posts and profile.'
        }
      }
    });
  } catch (error: any) {
    console.error('Toggle privacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
