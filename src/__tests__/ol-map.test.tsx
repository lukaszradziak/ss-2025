import {describe, it, expect} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import OlMap from '../components/ol-map'

vi.mock('swr', () => {
    return {
        __esModule: true,
        default: () => ({
            data: {
                // noop
            },
            error: null,
        }),
    }
})

vi.mock('../services/map-builder', () => {
    return {
        MapBuilder: vi.fn().mockImplementation(() => {
            return {
                setup: vi.fn(() => {
                    // noop
                }),
                getMap: vi.fn(() => {
                    // noop
                }),
            };
        }),
    };
})

describe('OlMap Component', () => {
    it('renders correctly', async () => {
        render(<OlMap />)

        await waitFor(() => {
            expect(screen.getByText('StreetMap')).toBeInTheDocument()
            expect(screen.getByText('RGB Raster')).toBeInTheDocument()
            expect(screen.getByText('Elevation Raster')).toBeInTheDocument()
            expect(screen.getByText('Vector')).toBeInTheDocument()
        })
    })

    it('is visible', async () => {
        render(<OlMap />)

        const checkbox = await screen.findByTestId('visible_1');
        expect(checkbox).toBeChecked();
    })
})
