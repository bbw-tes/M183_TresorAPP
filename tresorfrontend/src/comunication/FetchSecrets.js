/**
 * Fetch methodes for secret api calls
 * @author Peter Rutschmann
 */

const getApiUrl = () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL;
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const path = process.env.REACT_APP_API_PATH;
    const portPart = port ? `:${port}` : '';
    return `${protocol}://${host}${portPart}${path}`;
};

// Post secret to server
export const postSecret = async ({loginValues, content}) => {
    const API_URL = getApiUrl();
    console.log(loginValues);

    try {
        const response = await fetch(`${API_URL}/secrets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password,
                content: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('Secret successfully posted:', data);
        return data;
    } catch (error) {
        console.error('Error posting secret:', error.message);
        throw new Error('Failed to save secret. ' || error.message);
    }
};

// Get all secrets for a user identified by its email
export const getSecretsforUser = async (loginValues) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(`${API_URL}/secrets/byemail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('Secret successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get secrets:', error.message);
        throw new Error('Failed to get secrets. ' || error.message);
    }
};

// Update secret by id
export const updateSecret = async (secretId, loginValues, content) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(`${API_URL}/secrets/${secretId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password,
                content: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Update failed.');
        }

        const data = await response.json();
        console.log('Secret successfully updated:', data);
        return data;
    } catch (error) {
        console.error('Failed to update secret:', error.message);
        throw new Error('Failed to update secret. ' + error.message);
    }
};

// Delete secret by id
export const deleteSecret = async (secretId) => {
    const API_URL = getApiUrl();

    try {
        const response = await fetch(`${API_URL}/secrets/${secretId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Server response failed.');
        }

        console.log('Secret successfully deleted:', secretId);
        return true;
    } catch (error) {
        console.error('Failed to delete secret:', error.message);
        throw new Error('Failed to delete secret. ' + error.message);
    }
};