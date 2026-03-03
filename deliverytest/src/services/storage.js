import { supabase } from '../lib/supabase';

/**
 * Upload de imagem de produto para o Supabase Storage.
 * Gera nome único para evitar conflitos.
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<string>} - URL pública da imagem
 */
export const uploadProductImage = async (file) => {
    try {
        // Validação básica
        if (!file) throw new Error('Nenhum arquivo selecionado.');
        if (!file.type.startsWith('image/')) throw new Error('Apenas imagens são permitidas.');
        if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5MB.');

        // Gera nome único: timestamp_random.ext
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = fileName;

        // Upload
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // URL pública
        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
