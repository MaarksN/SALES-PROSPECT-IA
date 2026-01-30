
import React from 'react';
import Button from '../ui/Button';

export const DesignSystemViewer = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold">Local Storybook</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                    <h4 className="mb-2 text-sm text-slate-500">Buttons</h4>
                    <div className="flex flex-wrap gap-2">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="danger">Danger</Button>
                    </div>
                </div>
                <div className="p-4 border rounded bg-slate-900 text-white">
                    <h4 className="mb-2 text-sm text-slate-400">Dark Mode</h4>
                    <div className="flex flex-wrap gap-2">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
