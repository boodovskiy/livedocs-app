import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const Document = async ({ params }: SearchParamProps) => {
  const { id: roomId } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const room = await getDocument({ roomId, userId: clerkUser.emailAddresses[0].emailAddress });

  if (!room) redirect('/');

  // TODO: Assess the permission level of the user to access the document


  return (
    <div className='flex w-full flex-col items-center'>
        <CollaborativeRoom
            roomId={roomId}
            roomMetadata={room.metadata}
        />
    </div>
  )
}

export default Document