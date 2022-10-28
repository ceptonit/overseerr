import { RefreshIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import PR from 'pulltorefreshjs';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

const PullToRefresh: React.FC = () => {
  const router = useRouter();
  const [bodyIsLocked, setBodyIsLocked] = useState(false);

  // Checks if modal has been opened/closed
  useEffect(() => {
    const checkBodyOverflow = () => {
      if (document.body.style.overflow === 'hidden') {
        setBodyIsLocked(true);
      } else {
        setBodyIsLocked(false);
      }
    };
    window.addEventListener('transitionstart', () =>
      setTimeout(checkBodyOverflow, 100)
    );
    window.addEventListener('transitionend', () =>
      setTimeout(checkBodyOverflow, 100)
    );

    return () => {
      window.removeEventListener('transitionstart', () =>
        setTimeout(checkBodyOverflow, 100)
      );
      window.removeEventListener('transitionend', () =>
        setTimeout(checkBodyOverflow, 100)
      );
    };
  }, []);

  useEffect(() => {
    PR.init({
      mainElement: '#pull-to-refresh',
      onRefresh() {
        router.reload();
      },
      iconArrow: ReactDOMServer.renderToString(
        <div className="p-2">
          <RefreshIcon className="z-50 m-auto h-9 w-9 rounded-full border-4 border-gray-800 bg-gray-800 text-indigo-500 ring-1 ring-gray-700" />
        </div>
      ),
      iconRefreshing: ReactDOMServer.renderToString(
        <div
          className="animate-spin p-2"
          style={{ animationDirection: 'reverse' }}
        >
          <RefreshIcon className="z-50 m-auto h-9 w-9 rounded-full border-4 border-gray-800 bg-gray-800 text-indigo-500 ring-1 ring-gray-700" />
        </div>
      ),
      instructionsPullToRefresh: ReactDOMServer.renderToString(<div />),
      instructionsReleaseToRefresh: ReactDOMServer.renderToString(<div />),
      instructionsRefreshing: ReactDOMServer.renderToString(<div />),
      distReload: 60,
      distIgnore: 15,
      shouldPullToRefresh: () => !window.scrollY && !bodyIsLocked,
    });
    return () => {
      PR.destroyAll();
    };
  }, [bodyIsLocked, router]);

  return <div id="pull-to-refresh"></div>;
};

export default PullToRefresh;
