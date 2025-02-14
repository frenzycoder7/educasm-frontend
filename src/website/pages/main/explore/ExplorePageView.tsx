
// src/components/Explore/ExploreView.tsx
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import toast from 'react-hot-toast';
import { addHistory, addMessage, setLoadingMessageId } from '../../../store/slice/messages_slice';
import { Navigate } from 'react-router-dom';
import InitialViewComponent from './components/InitialViewComponent';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from 'react';
import MessageListViewComponent from './components/MessageListViewComponent';
import { useFetchExploreContent } from '../../../hooks/useFetchExploreContent';

export const ExplorePageView = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { mutate, isPending } = useFetchExploreContent();
    const dispatch = useDispatch()
    const { messages } = useSelector((state: RootState) => state.messages);
    const { user } = useSelector((state: RootState) => state.user);


    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            console.log('scrollRef.current', scrollRef.current)
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!user) {
        return <Navigate to="/" />;
    }

    const loadMessage = (query: string) => {
        if (isPending) {
            toast.error('Please wait for the previous message to finish loading');
            return;
        }

        const messageId = uuidv4();
        dispatch(addHistory(query));
        dispatch(setLoadingMessageId({
            messageId: messageId,
            isLoading: true,
        }));
        dispatch(addMessage({
            messageId: messageId,
            type: 'user',
            content: query,
        }));

        mutate({ query: query, age: user.age }, {
            onSuccess(data) {
                dispatch(addMessage(data));
                dispatch(setLoadingMessageId({
                    messageId: null,
                    isLoading: false,
                }));
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                        top: scrollRef.current.scrollHeight,
                        behavior: 'smooth'
                    })
                }
            },
        });
    }






    return (
        <div className="w-full  flex flex-col">
            {messages.length == 0 ? (
                <InitialViewComponent onSearch={loadMessage} isPlayground={false} />
            ) : (
                <MessageListViewComponent messages={messages} loadMessage={loadMessage} scrollRef={scrollRef} />
            )}
        </div>
    );
};

ExplorePageView.displayName = 'ExplorePage';