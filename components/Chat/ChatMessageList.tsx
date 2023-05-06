import { FC } from 'react';
import {
    Flex,
    Image } from '@mantine/core';
import { Message } from '@/types/chat';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import { MemoizedReactMarkdown } from '@/components/Markdown/MemoizedReactMarkdown';
import { CodeBlock } from '@/components/Markdown/CodeBlock';

interface Props {
    message: Message;
    cursor: string;
    messageIsStreaming:boolean;
}
const ChatMessageList: FC<Props> = ({message, cursor, messageIsStreaming}) => {
    
    return (
        <Flex
            gap="xs"
            sx={(theme) =>({
                paddingTop: theme.spacing.md,
                paddingBottom: theme.spacing.md
            })}
        >
            {
                message.role == "user" ?
                    <Image maw={30} src="icons/avatar_user.png" alt="chatgpt avatar" />:
                    <Image maw={30} src="icons/avatar_gpt.png" alt="chatgpt avatar" />
            }
            <MemoizedReactMarkdown
                className="prose dark:prose-invert flex-1"
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeMathjax]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    if (children.length) {
                      if (children[0] == '▍') {
                        return <span className="animate-pulse cursor-default mt-1">▍</span>
                      }

                      children[0] = (children[0] as string).replace("`▍`", "▍")
                    }

                    const match = /language-(\w+)/.exec(className || '');

                    return !inline ? (
                      <CodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ''}
                        value={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }) {
                    return (
                      <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                        {children}
                      </table>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="break-words border border-black px-3 py-1 dark:border-white">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {cursor}
              </MemoizedReactMarkdown>
        </Flex>
    )
}
export default ChatMessageList;