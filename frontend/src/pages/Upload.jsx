import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useContracts } from '../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  File,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Upload = () => {
  const { uploadContract } = useContracts();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadResult(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadContract(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [uploadContract]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'tiff':
      case 'bmp':
        return <Image className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload de Contrato</h1>
        <p className="text-gray-600 mt-1">
          Faça upload de seus contratos para análise automática
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Arquivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${uploading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            {isDragActive ? (
              <p className="text-lg text-blue-600">Solte o arquivo aqui...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Arraste e solte um arquivo aqui, ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  Suporte para PDF, Word, imagens (JPG, PNG) e arquivos de texto
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Fazendo upload...
                </span>
                <span className="text-sm text-gray-500">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Alert className="mt-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Upload realizado com sucesso!</strong>
                <br />
                Contrato ID: {uploadResult.contract_id} - Status: {uploadResult.status}
                <br />
                O processamento foi iniciado e você será notificado quando concluído.
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert className="mt-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Erro no upload:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle>Formatos Suportados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">PDF</p>
                <p className="text-xs text-gray-500">Documentos PDF</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Word</p>
                <p className="text-xs text-gray-500">DOC, DOCX</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Image className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Imagens</p>
                <p className="text-xs text-gray-500">JPG, PNG, TIFF</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <File className="h-6 w-6 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Texto</p>
                <p className="text-xs text-gray-500">TXT</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;

