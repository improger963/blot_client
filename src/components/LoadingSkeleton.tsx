import { Card } from './ui';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'profile';
  count?: number;
}

export const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1 
}: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map(i => (
          <Card key={i} className="p-6 rounded-2xl space-y-4">
            <div className="skeleton h-6 w-3/4 rounded-xl"></div>
            <div className="skeleton h-4 w-1/2 rounded-xl"></div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded-xl"></div>
              <div className="skeleton h-4 w-5/6 rounded-xl"></div>
              <div className="skeleton h-4 w-4/6 rounded-xl"></div>
            </div>
            <div className="skeleton h-10 w-full rounded-xl"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <Card className="p-8 rounded-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="skeleton h-24 w-24 rounded-2xl"></div>
          <div className="space-y-2 w-full max-w-xs">
            <div className="skeleton h-6 w-3/4 mx-auto rounded-xl"></div>
            <div className="skeleton h-4 w-1/2 mx-auto rounded-xl"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {skeletons.map(i => (
              <div key={i} className="skeleton h-20 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {skeletons.map(i => (
        <Card key={i} className="rounded-2xl h-20 mb-4 p-4" animate={false}>
          <div className="skeleton w-full h-full rounded-xl"></div>
        </Card>
      ))}
    </div>
  );
};