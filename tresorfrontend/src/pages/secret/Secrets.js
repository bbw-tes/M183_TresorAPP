import React, { useEffect, useState } from 'react';
import { getSecretsforUser, deleteSecret, updateSecret } from '../../comunication/FetchSecrets';

/**
 * Secrets
 * @author Peter Rutschmann
 */

const ContentCard = ({ content }) => {
    let parsed = content;
    if (typeof content === 'string') {
        try { parsed = JSON.parse(content); } catch { parsed = null; }
    }

    if (!parsed) return <pre className="content-pre">{String(content)}</pre>;

    if (parsed.kind === 'credential') {
        return (
            <div className="content-card">
                <span className="content-kind credential-kind">🔑 Credential</span>
                <div className="content-row"><span className="content-label">Username</span><span className="content-value">{parsed.userName}</span></div>
                <div className="content-row"><span className="content-label">Password</span><span className="content-value password">{'•'.repeat(Math.max(parsed.password?.length ?? 0, 6))}</span></div>
                {parsed.url && <div className="content-row"><span className="content-label">URL</span><span className="content-value"><a href={parsed.url} target="_blank" rel="noreferrer">{parsed.url}</a></span></div>}
            </div>
        );
    }

    if (parsed.kind === 'creditcard') {
        const masked = parsed.cardnumber ? '•••• •••• •••• ' + parsed.cardnumber.replace(/\s/g, '').slice(-4) : '––';
        return (
            <div className="content-card">
                <span className="content-kind creditcard-kind">💳 Credit Card</span>
                <div className="content-row"><span className="content-label">Type</span><span className="content-value">{parsed.cardtype}</span></div>
                <div className="content-row"><span className="content-label">Number</span><span className="content-value password">{masked}</span></div>
                <div className="content-row"><span className="content-label">Expires</span><span className="content-value">{parsed.expiration}</span></div>
                <div className="content-row"><span className="content-label">CVV</span><span className="content-value password">•••</span></div>
            </div>
        );
    }

    if (parsed.kind === 'note') {
        return (
            <div className="content-card">
                <span className="content-kind note-kind">📝 Note</span>
                <div className="content-row"><span className="content-label">Title</span><span className="content-value">{parsed.title}</span></div>
                {parsed.content && <div className="content-row note-content-row"><span className="content-label">Content</span><span className="content-value note-text">{parsed.content}</span></div>}
            </div>
        );
    }

    return <pre className="content-pre">{JSON.stringify(parsed, null, 2)}</pre>;
};

const EditForm = ({ secret, loginValues, onSave, onCancel, saving }) => {
    let parsed = secret.content;
    if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch { parsed = {}; }
    }

    const [fields, setFields] = useState({ ...parsed });
    const set = (key, val) => setFields(prev => ({ ...prev, [key]: val }));

    const handleSave = () => onSave(secret.id, fields);

    const inputClass = "edit-input";

    return (
        <div className="edit-form">
            {fields.kind === 'credential' && (
                <>
                    <span className="content-kind credential-kind">🔑 Credential</span>
                    <div className="edit-row"><label className="edit-label">Username</label><input className={inputClass} value={fields.userName || ''} onChange={e => set('userName', e.target.value)} /></div>
                    <div className="edit-row"><label className="edit-label">Password</label><input className={inputClass} type="text" value={fields.password || ''} onChange={e => set('password', e.target.value)} /></div>
                    <div className="edit-row"><label className="edit-label">URL</label><input className={inputClass} value={fields.url || ''} onChange={e => set('url', e.target.value)} /></div>
                </>
            )}
            {fields.kind === 'creditcard' && (
                <>
                    <span className="content-kind creditcard-kind">💳 Credit Card</span>
                    <div className="edit-row">
                        <label className="edit-label">Type</label>
                        <select className={inputClass} value={fields.cardtype || ''} onChange={e => set('cardtype', e.target.value)}>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                        </select>
                    </div>
                    <div className="edit-row"><label className="edit-label">Number</label><input className={inputClass} value={fields.cardnumber || ''} onChange={e => set('cardnumber', e.target.value)} /></div>
                    <div className="edit-row"><label className="edit-label">Expires</label><input className={inputClass} placeholder="mm/yy" value={fields.expiration || ''} onChange={e => set('expiration', e.target.value)} /></div>
                    <div className="edit-row"><label className="edit-label">CVV</label><input className={inputClass} value={fields.cvv || ''} onChange={e => set('cvv', e.target.value)} /></div>
                </>
            )}
            {fields.kind === 'note' && (
                <>
                    <span className="content-kind note-kind">📝 Note</span>
                    <div className="edit-row"><label className="edit-label">Title</label><input className={inputClass} value={fields.title || ''} onChange={e => set('title', e.target.value)} /></div>
                    <div className="edit-row"><label className="edit-label">Content</label><textarea className={inputClass} rows={3} value={fields.content || ''} onChange={e => set('content', e.target.value)} /></div>
                </>
            )}
            <div className="edit-actions">
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? '⏳ Saving…' : '✓ Save'}
                </button>
                <button className="btn-cancel" onClick={onCancel} disabled={saving}>✕ Cancel</button>
            </div>
        </div>
    );
};

const Secrets = ({ loginValues }) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        const fetchSecrets = async () => {
            setErrorMessage('');
            if (!loginValues.email) {
                setErrorMessage('No valid email, please do login first.');
            } else {
                try {
                    const data = await getSecretsforUser(loginValues);
                    setSecrets(data);
                } catch (error) {
                    setErrorMessage(error.message);
                }
            }
        };
        fetchSecrets();
    }, [loginValues]);

    const handleDelete = async (secretId) => {
        if (!window.confirm('Are you sure you want to delete this secret? This cannot be undone.')) return;
        setDeletingId(secretId);
        try {
            await deleteSecret(secretId);
            setSecrets(prev => prev.filter(s => s.id !== secretId));
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSave = async (secretId, updatedFields) => {
        setSavingId(secretId);
        try {
            await updateSecret(secretId, loginValues, updatedFields);

            // Update local state with new content
            setSecrets(prev => prev.map(s =>
                s.id === secretId ? { ...s, content: updatedFields } : s
            ));
            setEditingId(null);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSavingId(null);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');

        .secrets-root {
          font-family: 'Sora', sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          color: #1a1a2e;
        }

        .secrets-header {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .secrets-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
          color: #0f0f1a;
        }

        .secrets-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
          border-radius: 4px;
          padding: 2px 8px;
          letter-spacing: 0.05em;
        }

        .secrets-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff3f3;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #b91c1c;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .secrets-error::before { content: '⚠'; font-size: 1rem; flex-shrink: 0; }

        .secrets-table-wrapper {
          border: 1px solid #e2e4ed;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }

        .secrets-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .secrets-table thead {
          background: #f5f6fa;
          border-bottom: 1px solid #e2e4ed;
        }

        .secrets-table thead th {
          padding: 0.75rem 1.25rem;
          text-align: left;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          white-space: nowrap;
        }

        .secrets-table thead th.th-action { text-align: right; }

        .secrets-table tbody tr {
          border-bottom: 1px solid #f0f1f5;
          transition: background 0.15s;
        }

        .secrets-table tbody tr:last-child { border-bottom: none; }
        .secrets-table tbody tr:hover { background: #fafbff; }
        .secrets-table tbody tr.row-editing { background: #fafbff; }

        .secrets-table tbody td {
          padding: 0.9rem 1.25rem;
          vertical-align: top;
          color: #374151;
        }

        .secrets-table tbody td.td-action {
          text-align: right;
          vertical-align: middle;
          white-space: nowrap;
        }

        .id-chip {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          background: #f0f1f5;
          border-radius: 5px;
          padding: 2px 7px;
          color: #4b5563;
        }

        /* Content card */
        .content-card { display: flex; flex-direction: column; gap: 0.35rem; }

        .content-kind {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border-radius: 4px;
          padding: 2px 7px;
          display: inline-block;
          margin-bottom: 0.25rem;
          width: fit-content;
        }

        .credential-kind { background: #ede9fe; color: #5b21b6; }
        .creditcard-kind { background: #fef3c7; color: #92400e; }
        .note-kind       { background: #e0f2fe; color: #075985; }

        .content-row { display: flex; align-items: baseline; gap: 0.5rem; }

        .content-label {
          font-size: 0.7rem;
          color: #9ca3af;
          width: 72px;
          flex-shrink: 0;
        }

        .content-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.775rem;
          color: #1f2937;
          word-break: break-all;
        }

        .content-value.password { letter-spacing: 0.12em; color: #9ca3af; }
        .content-value a { color: #6366f1; text-decoration: none; }
        .content-value a:hover { text-decoration: underline; }
        .note-content-row { align-items: flex-start; }
        .note-text {
          white-space: pre-wrap;
          line-height: 1.5;
          font-family: 'Sora', sans-serif !important;
          font-size: 0.8rem !important;
          color: #374151;
        }

        .content-pre {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.775rem;
          background: #f8f9fc;
          border: 1px solid #e8eaf0;
          border-radius: 6px;
          padding: 0.6rem 0.8rem;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          color: #374151;
          line-height: 1.6;
        }

        /* Edit form */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .edit-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-label {
          font-size: 0.7rem;
          color: #9ca3af;
          width: 72px;
          flex-shrink: 0;
        }

        .edit-input {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.775rem;
          color: #1f2937;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          width: 100%;
          max-width: 340px;
          outline: none;
          transition: border-color 0.15s;
        }

        .edit-input:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #ede9fe; }

        textarea.edit-input {
          resize: vertical;
          min-height: 70px;
          font-family: 'Sora', sans-serif;
        }

        .edit-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        /* Buttons */
        .btn-delete, .btn-edit, .btn-save, .btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: 'Sora', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 6px;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }

        .btn-delete {
          color: #dc2626;
          background: #fff;
          border: 1px solid #fca5a5;
        }
        .btn-delete:hover { background: #fef2f2; border-color: #dc2626; }

        .btn-edit {
          color: #4f46e5;
          background: #fff;
          border: 1px solid #c7d2fe;
        }
        .btn-edit:hover { background: #eef2ff; border-color: #4f46e5; }

        .btn-save {
          color: #fff;
          background: #4f46e5;
          border: 1px solid #4f46e5;
        }
        .btn-save:hover { background: #4338ca; border-color: #4338ca; }

        .btn-cancel {
          color: #6b7280;
          background: #fff;
          border: 1px solid #e5e7eb;
        }
        .btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }

        .btn-delete:disabled, .btn-edit:disabled,
        .btn-save:disabled, .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-group {
          display: inline-flex;
          gap: 0.4rem;
          justify-content: flex-end;
        }

        .secrets-empty {
          padding: 3rem 1.25rem;
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .secrets-empty span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }

        .secrets-count {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.75rem;
          text-align: right;
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>

            <div className="secrets-root">
                <div className="secrets-header">
                    <h1>My Secrets</h1>
                    <span className="secrets-badge">ENCRYPTED</span>
                </div>

                {errorMessage && (
                    <div className="secrets-error">{errorMessage}</div>
                )}

                <div className="secrets-table-wrapper">
                    <table className="secrets-table">
                        <thead>
                        <tr>
                            <th>Secret ID</th>
                            <th>Content</th>
                            <th className="th-action">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {secrets?.length > 0 ? (
                            secrets.map((secret) => (
                                <tr key={secret.id} className={editingId === secret.id ? 'row-editing' : ''}>
                                    <td><span className="id-chip">{secret.id}</span></td>
                                    <td>
                                        {editingId === secret.id
                                            ? <EditForm
                                                secret={secret}
                                                loginValues={loginValues}
                                                onSave={handleSave}
                                                onCancel={() => setEditingId(null)}
                                                saving={savingId === secret.id}
                                            />
                                            : <ContentCard content={secret.content} />
                                        }
                                    </td>
                                    <td className="td-action">
                                        {editingId === secret.id ? null : (
                                            <div className="action-group">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => setEditingId(secret.id)}
                                                    disabled={!!deletingId}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(secret.id)}
                                                    disabled={deletingId === secret.id}
                                                >
                                                    {deletingId === secret.id ? '⏳' : '🗑 Delete'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">
                                    <div className="secrets-empty">
                                        <span>🔒</span>
                                        No secrets available
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {secrets?.length > 0 && (
                    <p className="secrets-count">{secrets.length} secret{secrets.length !== 1 ? 's' : ''} loaded</p>
                )}
            </div>
        </>
    );
};

export default Secrets;