import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorBabProps {
    /** Current HTML content of the editor (controlled). */
    value: string;
    /** Called with the new HTML string on every content change. */
    onChange: (data: string) => void;
    /** Placeholder text shown when the editor is empty. */
    placeholder?: string;
}

/**
 * Wrapper around CKEditor 5 (Classic build) pre-configured with a sensible
 * toolbar for chapter/story writing.
 *
 * @example
 * <CKEditorBab
 *   value={data.content}
 *   onChange={(html) => setData('content', html)}
 *   placeholder="Tumpahkan imajinasimu di sini..."
 * />
 */
export default function CKEditorBab({
    value,
    onChange,
    placeholder = 'Mulai menulis di sini...',
}: CKEditorBabProps) {
    return (
        <div className="ckeditor-modern-wrapper">
            <CKEditor
                editor={ClassicEditor as any}
                data={value}
                config={{
                    placeholder,
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'link',
                        'bulletedList', 'numberedList', '|',
                        'blockQuote', 'insertTable',
                        'undo', 'redo',
                    ],
                    removePlugins: ['Heading1'],
                }}
                onChange={(_event, editor) => {
                    onChange(editor.getData());
                }}
            />
        </div>
    );
}
