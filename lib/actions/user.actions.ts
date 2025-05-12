'use server';
import { createClerkClient } from '@clerk/nextjs/server';
import { parseStringify } from '../utils';
import { liveblocks } from '../liveblocks';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY as string,
});

export const getClerkUsers = async ({ userIds }: { userIds: string[]}) => {
    try {
        const response  = await clerkClient.users.getUserList({
            emailAddress: userIds,
        });

        const users = response.data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }))
        
        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.error('Error happened while getting users:', error);
    }
}

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));
            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.error('Error happened while fetchinig document users:', error);
    }
}