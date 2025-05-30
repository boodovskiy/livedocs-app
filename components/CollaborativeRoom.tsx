'use client';
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { updateDocument } from '@/lib/actions/room.actions';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ActiveCollaborators from './ActiveCollaborators';
import Loader from './Loader';
import ShareModal from './ShareModal';
import { Input } from './ui/input';

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title || 'Untitled Document');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setLoading(true);
        
        try {
            if (documentTitle !== roomMetadata?.title) {
                const updatedDocument = await updateDocument(roomId, documentTitle);

                if (updatedDocument) {
                    setEditing(false);
                } 
            }
        } catch (error) {
            console.error('Error updating title:', error);
        }

        setLoading(false);
      }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                updateDocument(roomId, documentTitle);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [roomId, documentTitle])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
            <div className="collaborative-room">
                <Header>
                    <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                        {editing && !loading ? (
                            <Input 
                                type="email"
                                value={documentTitle}
                                ref={inputRef}
                                placeholder='Enter title...'
                                onChange={(e) => setDocumentTitle(e.target.value)}
                                onKeyDown={(e) => updateTitleHandler(e)}
                                disabled={!editing}
                                className='document-title-input'
                            />
                        ) : (
                            <>
                                <p className='document-title'>{documentTitle}</p>
                            </>
                        )}

                        {currentUserType === 'editor' && !editing && (
                            <Image 
                                src='/assets/icons/edit.svg'
                                alt='Edit'
                                width={24}
                                height={24}
                                className='pointer'
                                onClick={() => {
                                    setEditing(true);
                                }}
                            />
                        )}

                        {currentUserType !== 'editor' && !editing && (
                            <p className='view-only-tag'>View Only</p>
                        )}

                        {loading && <p className='text-sm text-gray-400'>saving ...</p>}
                    </div>
                    
                    {/* Collaborators & Actions */}
                    <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                        <ActiveCollaborators />

                        <ShareModal 
                            roomId={roomId}
                            collaborators={users}
                            creatorId={roomMetadata?.creatorId}
                            currentUserType={currentUserType} 
                        />

                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </Header>
                <Editor roomId={roomId} currentUserType={currentUserType}/>
            </div>
        </ClientSideSuspense>
  </RoomProvider>
  )
}

export default CollaborativeRoom