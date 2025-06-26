import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CanvasImage } from './context';

// Store mock images per user ID
const MOCK_IMAGES_BY_USER: Record<number, CanvasImage[]> = {};

const DEFAULT_IMAGES: CanvasImage[] = [
  {
    id: 1,
    x: 0,
    y: 0,
    rotation: 0,
    url: 'https://ttv.madf12.com/mge/static/rofls/canny.webp',
    width: 200,
    height: 200,
    zIndex: 0,
    scaleX: 1,
    scaleY: 1,
  },
  // {
  //   id: 2,
  //   x: 0,
  //   y: 0,
  //   rotation: 0,
  //   url: 'https://ttv.madf12.com/mge/static/rofls/cat1.webp',
  //   width: 200,
  //   height: 200,
  //   zIndex: 0,
  //   scaleX: 1,
  // },
  // {
  //   id: 3,
  //   x: 0,
  //   y: 0,
  //   rotation: 0,
  //   url: 'https://ttv.madf12.com/mge/static/rofls/cuteCat.webp',
  //   width: 200,
  //   height: 200,
  //   zIndex: 0,
  //   scaleX: 1,
  // },
  // {
  //   id: 4,
  //   x: 0,
  //   y: 0,
  //   rotation: 0,
  //   url: 'https://ttv.madf12.com/mge/static/rofls/plink.webp',
  //   width: 200,
  //   height: 200,
  //   zIndex: 0,
  //   scaleX: 1,
  // },
  // {
  //   id: 5,
  //   x: 0,
  //   y: 0,
  //   rotation: 0,
  //   url: 'https://media1.tenor.com/m/5BYK-WS0__gAAAAd/cool-fun.gif',
  //   width: 200,
  //   height: 200,
  //   zIndex: 0,
  //   scaleX: 1,
  // },
];

async function fetchImages(playerId: number): Promise<CanvasImage[]> {
  console.log('fetching canvas images from local JSON for user', playerId)

  try {
    // Try to fetch user-specific canvas file first
    const response = await fetch(`/api/canvas-${playerId}.json`)
    if (response.ok) {
      const data = await response.json()
      return data.objects || []
    }
  } catch (error) {
    console.log(`No specific canvas file for user ${playerId}, falling back to default`)
  }

  try {
    // Fall back to default canvas.json
    const response = await fetch('/api/canvas.json')
    if (response.ok) {
      const data = await response.json()
      return data.objects || []
    }
  } catch (error) {
    console.log('No default canvas file found, using empty array')
  }

  // Return empty array if no files found
  return []
}

export function useGetCanvasImages(playerId: number) {
  return useQuery({
    initialData: [],
    queryKey: ['canvas-images', playerId],
    queryFn: () => fetchImages(playerId),
    select: (data) => {
      return data.sort((a, b) => a.zIndex - b.zIndex);
    },
    refetchInterval: 15000,
  });
}

function saveCanvasImages(playerId: number, imageList: CanvasImage[]) {
  // Store images per user ID in mock storage
  MOCK_IMAGES_BY_USER[playerId] = imageList;
  console.log(`saving canvas images for user ${playerId} (local mock)`, imageList);
  return Promise.resolve(new Response());
}

export function useSaveCanvasImages(playerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageList: CanvasImage[]) => saveCanvasImages(playerId, imageList),
    async onSettled() {
      await queryClient.invalidateQueries({ queryKey: ['canvas-images', playerId] });
    },
  });
}

function uploadCanvasImage(playerId: number, file: File, width: number, height: number) {
  console.log(`uploading canvas image for user ${playerId} (local mock)`);

  // Initialize user's images if they don't exist
  if (!MOCK_IMAGES_BY_USER[playerId]) {
    MOCK_IMAGES_BY_USER[playerId] = [];
  }

  // Generate new ID based on existing images for this user
  const existingIds = MOCK_IMAGES_BY_USER[playerId].map(img => img.id);
  const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  MOCK_IMAGES_BY_USER[playerId].push({
    id: newId,
    x: 0,
    y: 0,
    rotation: 0,
    url: URL.createObjectURL(file),
    width,
    height,
    zIndex: 0,
    scaleX: 1,
    scaleY: 1,
  });

  return Promise.resolve(new Response());
}

export function useUploadCanvasImage(playerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { file: File, width: number, height: number }) =>
      uploadCanvasImage(playerId, data.file, data.width, data.height),
    async onSettled() {
      await queryClient.invalidateQueries({ queryKey: ['canvas-images', playerId] });
    },
  });
}
