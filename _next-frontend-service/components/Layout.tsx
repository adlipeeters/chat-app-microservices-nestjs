import ReactQueryProvider from '../providers/ReactQueryProvider';
import queryClient from '../providers/ReactQueryProvider';

const BaseLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto max-w-4xl h-full w-full">
            {children}
        </div>
    );
}

export default BaseLayout;