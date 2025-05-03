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
            defaultAccesses: [],
       });

       revalidatePath('/');
       
       return parseStringify(room);

    } catch (error) {   
        console.error('Error happened while creating a room:', error);
    }
}