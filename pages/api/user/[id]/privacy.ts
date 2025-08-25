import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/database';
import User from '../../../../lib/models/User';
import { verifyToken } from '../../../../lib/middleware/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // Get user ID from URL
    const { id: userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

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

    // Check if user is trying to modify their own privacy
    if (decoded.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own privacy settings'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get current privacy status
        return res.json({
          success: true,
          data: {
            user: {
              id: user._id,
              username: user.username,
              fullName: user.fullName,
              isPrivate: user.isPrivate,
              followersCount: user.followersCount,
              followingCount: user.followingCount
            },
            privacyInfo: {
              currentStatus: user.isPrivate ? 'private' : 'public',
              description: user.isPrivate 
                ? 'Your account is private. Only approved followers can see your posts and profile.'
                : 'Your account is public. Anyone can see your posts and profile.',
              implications: user.isPrivate 
                ? [
                    'Only approved followers can see your posts',
                    'Profile information is limited to followers',
                    'New followers must be approved by you',
                    'Your content won\'t appear in public searches'
                  ]
                : [
                    'Anyone can see your posts and profile',
                    'Your content appears in public searches',
                    'Anyone can follow you without approval',
                    'Maximum visibility and discoverability'
                  ]
            }
          }
        });

      case 'PUT':
        // Update privacy status
        const { isPrivate } = req.body;

        // Validate input
        if (typeof isPrivate !== 'boolean') {
          return res.status(400).json({
            success: false,
            message: 'isPrivate must be a boolean value (true for private, false for public)'
          });
        }

        // Check if privacy is actually changing
        if (user.isPrivate === isPrivate) {
          return res.json({
            success: true,
            message: `Account is already ${isPrivate ? 'private' : 'public'}`,
            data: {
              user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                isPrivate: user.isPrivate,
                followersCount: user.followersCount,
                followingCount: user.followingCount
              },
              privacyChanged: false,
              currentStatus: isPrivate ? 'private' : 'public'
            }
          });
        }

        // Update user privacy
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { isPrivate },
          { new: true, runValidators: true }
        );

        // Check if update was successful
        if (!updatedUser) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update user privacy'
          });
        }

        return res.json({
          success: true,
          message: `Account privacy updated successfully`,
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
              message: isPrivate 
                ? 'Your account is now private. Only approved followers can see your posts and profile.'
                : 'Your account is now public. Anyone can see your posts and profile.',
              implications: isPrivate 
                ? [
                    'Only approved followers can see your posts',
                    'Profile information is limited to followers',
                    'New followers must be approved by you',
                    'Your content won\'t appear in public searches'
                  ]
                : [
                    'Anyone can see your posts and profile',
                    'Your content appears in public searches',
                    'Anyone can follow you without approval',
                    'Maximum visibility and discoverability'
                  ]
            }
          }
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed. Use GET to view privacy status or PUT to update it.'
        });
    }
  } catch (error: any) {
    console.error('Privacy API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
