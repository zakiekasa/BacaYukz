import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorBabProps {
    value: string;
    onChange: (data: string) => void;
    placeholder?: string;
}

export default function CKEditorBab({ value, onChange, placeholder = 'Mulai menulis di sini...' }: CKEditorBabProps) {
    return (
        <div className="ckeditor-modern-wrapper">
            <CKEditor
                editor={ClassicEditor as any} // Casting ke 'any' untuk mematikan type mismatch
                data={value}
                config={{
                    placeholder: placeholder,
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'undo',
                        'redo'
                    ],
                    removePlugins: ['Heading1'],
                }}
                onChange={(event, editor) => { // Menggunakan auto-type inference
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            {/* CSS styles tetap sama */}
        </div>
    );
}
