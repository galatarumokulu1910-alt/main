import type { Artifact } from '../components/ArtifactCard/ArtifactCard';
import { objectsArtifacts } from './objectsArtifacts';
import { documentsArtifacts } from './documentsArtifacts';

// Combine all artifact collections into a single export
export const sampleArtifacts: Artifact[] = [
    ...objectsArtifacts,
    ...documentsArtifacts,
];
