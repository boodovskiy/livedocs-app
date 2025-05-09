'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '@/lib/liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';

export const createDocument = async ({userId, email}: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
       const metadata = {
            creatorId: userId,
            title: 'Untitled',
            email: email,
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write'],
        }

       const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ['room:write'],
       });

       revalidatePath('/');
       
       return parseStringify(room);

    } catch (error) {   
        console.error('Error happened while creating a room:', error);
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        
        // TODO: Bring this back when we have the user access system in place
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        // if (!hasAccess) {
        //     throw new Error('You do not have access to this document.');
        // }
    
        return parseStringify(room);
    } catch (error) {
        console.log('Error happened while getting a room:', error);
    }
}

export const updateDocument = async ( roomId: string, title: string ) => {
    try {
        const updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            },
        })

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updateRoom);
    } catch (error) {
        console.error('Error happened while updating a room:', error);
    }
}

export const getDocuments = async (email: string ) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });
    
        return parseStringify(rooms);
    } catch (error) {
        console.log('Error happened while getting a rooms:', error);
    }
}
