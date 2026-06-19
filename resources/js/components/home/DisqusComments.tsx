import React, { useEffect } from 'react';

type DisqusCommentsProps = {
    shortname: string;
    config: {
        url: string;
        identifier: string;
        title: string;
    };
};

export default function DisqusComments({ shortname, config }: DisqusCommentsProps) {
    useEffect(() => {
        const resetDisqus = () => {
            const DISQUS = (window as any).DISQUS;
            if (DISQUS !== undefined) {
                DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.url = config.url;
                        this.page.identifier = config.identifier;
                        this.page.title = config.title;
                    }
                });
            } else {
                (window as any).disqus_config = function () {
                    this.page.url = config.url;
                    this.page.identifier = config.identifier;
                    this.page.title = config.title;
                };

                const script = document.createElement('script');
                script.src = `https://${shortname}.disqus.com/embed.js`;
                script.setAttribute('data-timestamp', +new Date() + '');
                script.setAttribute('async', 'true');
                document.body.appendChild(script);
            }
        };

        resetDisqus();
    }, [config, shortname]);

    return (
        <div className="mt-5 p-4 border border-light-subtle rounded-4 bg-light-subtle shadow-sm animate-fade-in">
            <h5 className="fw-bold mb-4 text-dark"><i className="fa-regular fa-comments me-2 text-secondary"></i>Kolom Komentar</h5>
            <div id="disqus_thread"></div>
        </div>
    );
}
