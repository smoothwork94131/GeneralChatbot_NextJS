import { FC } from 'react';
import {
    Flex} from '@mantine/core';
import { Message } from '@/types/chat';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import { MemoizedReactMarkdown } from '@/components/Markdown/MemoizedReactMarkdown';
import { CodeBlock } from '@/components/Markdown/CodeBlock';


interface Props {
    message: Message;
    messageIsStreaming:boolean;
    cursor: string;
    index: number;
}
const ChatMessageList: FC<Props> = ({message, messageIsStreaming, cursor, index}) => {
    const handleCopyToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      copyToClipboard(message.content);
    };
    function copyToClipboard(text: string) {
      if (typeof navigator !== 'undefined')
        navigator.clipboard.writeText(text)
          .then(() => console.log('Message copied to clipboard'))
          .catch((err) => console.error('Failed to copy message: ', err));
    }
    return (  
        <Flex
            gap="xs"
            sx={(theme) =>({
                paddingTop: theme.spacing.md,
                paddingBottom: theme.spacing.md,
                '&:hover > .copy-assistant': { display: 'block' },
            })}
        >   
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
              {
                cursor
              }
            </MemoizedReactMarkdown>
            
            
        </Flex>
    )
}
export default ChatMessageList;