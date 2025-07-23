import * as clientService from '../../../modules/client/client.service';
import * as clientRepository from '../../../modules/client/client.repository';
import {
  mockCreateClientDto,
  mockUpdateClientDto,
  mockClient,
  mockClients,
} from '../../mocks/client.mock';
import { ClientNotFoundError } from '../../../errors/ClientNotFoundError';
import { errorHandler } from '../../../handlers/errorHandler';

// Mock the repository module
jest.mock('../../../modules/client/client.repository');
const mockClientRepository = clientRepository as jest.Mocked<
  typeof clientRepository
>;

// Mock the error handler
jest.mock('../../../handlers/errorHandler');
const mockErrorHandler = errorHandler as jest.MockedFunction<
  typeof errorHandler
>;

describe('Client Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a client successfully', async () => {
      mockClientRepository.createClient.mockResolvedValue(mockClient);

      const result = await clientService.createClient(mockCreateClientDto);

      expect(mockClientRepository.createClient).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(result).toEqual(mockClient);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should call errorHandler when repository throws an error', async () => {
      const repositoryError = new Error('Database error');
      mockClientRepository.createClient.mockRejectedValue(repositoryError);

      await clientService.createClient(mockCreateClientDto);

      expect(mockClientRepository.createClient).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(repositoryError);
    });
  });

  describe('getAllClients', () => {
    it('should return all clients successfully', async () => {
      mockClientRepository.getAllClients.mockResolvedValue(mockClients);

      const result = await clientService.getAllClients();

      expect(mockClientRepository.getAllClients).toHaveBeenCalled();
      expect(result).toEqual(mockClients);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should call errorHandler when repository throws an error', async () => {
      const repositoryError = new Error('Database connection failed');
      mockClientRepository.getAllClients.mockRejectedValue(repositoryError);

      await clientService.getAllClients();

      expect(mockClientRepository.getAllClients).toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(repositoryError);
    });
  });

  describe('getClientById', () => {
    it('should return client when found', async () => {
      mockClientRepository.getClientById.mockResolvedValue(mockClient);

      const result = await clientService.getClientById('client-123');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(result).toEqual(mockClient);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should throw ClientNotFoundError when client does not exist', async () => {
      mockClientRepository.getClientById.mockResolvedValue(null);

      await clientService.getClientById('non-existent-id');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.any(ClientNotFoundError),
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('non-existent-id'),
        }),
      );
    });

    it('should call errorHandler when repository throws an error', async () => {
      const repositoryError = new Error('Database connection failed');
      mockClientRepository.getClientById.mockRejectedValue(repositoryError);

      await clientService.getClientById('client-123');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(repositoryError);
    });
  });

  describe('updateClient', () => {
    it('should update client successfully when client exists', async () => {
      const updatedClient = { ...mockClient, ...mockUpdateClientDto };
      mockClientRepository.getClientById.mockResolvedValue(mockClient);
      mockClientRepository.updateClient.mockResolvedValue(updatedClient);

      const result = await clientService.updateClient(
        'client-123',
        mockUpdateClientDto,
      );

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.updateClient).toHaveBeenCalledWith(
        'client-123',
        mockUpdateClientDto,
      );
      expect(result).toEqual(updatedClient);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should throw ClientNotFoundError when client does not exist', async () => {
      mockClientRepository.getClientById.mockResolvedValue(null);

      await clientService.updateClient('non-existent-id', mockUpdateClientDto);

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(mockClientRepository.updateClient).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.any(ClientNotFoundError),
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('non-existent-id'),
        }),
      );
    });

    it('should call errorHandler when getClientById throws an error', async () => {
      const repositoryError = new Error('Database error during lookup');
      mockClientRepository.getClientById.mockRejectedValue(repositoryError);

      await clientService.updateClient('client-123', mockUpdateClientDto);

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.updateClient).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(repositoryError);
    });

    it('should call errorHandler when updateClient throws an error', async () => {
      const updateError = new Error('Database error during update');
      mockClientRepository.getClientById.mockResolvedValue(mockClient);
      mockClientRepository.updateClient.mockRejectedValue(updateError);

      await clientService.updateClient('client-123', mockUpdateClientDto);

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.updateClient).toHaveBeenCalledWith(
        'client-123',
        mockUpdateClientDto,
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(updateError);
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully when client exists', async () => {
      mockClientRepository.getClientById.mockResolvedValue(mockClient);
      mockClientRepository.deleteClient.mockResolvedValue(mockClient);

      const result = await clientService.deleteClient('client-123');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.deleteClient).toHaveBeenCalledWith(
        'client-123',
      );
      expect(result).toEqual(mockClient);
      expect(mockErrorHandler).not.toHaveBeenCalled();
    });

    it('should throw ClientNotFoundError when client does not exist', async () => {
      mockClientRepository.getClientById.mockResolvedValue(null);

      await clientService.deleteClient('non-existent-id');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(mockClientRepository.deleteClient).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.any(ClientNotFoundError),
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('non-existent-id'),
        }),
      );
    });

    it('should call errorHandler when getClientById throws an error', async () => {
      const repositoryError = new Error('Database error during lookup');
      mockClientRepository.getClientById.mockRejectedValue(repositoryError);

      await clientService.deleteClient('client-123');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.deleteClient).not.toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(repositoryError);
    });

    it('should call errorHandler when deleteClient throws an error', async () => {
      const deleteError = new Error('Database error during deletion');
      mockClientRepository.getClientById.mockResolvedValue(mockClient);
      mockClientRepository.deleteClient.mockRejectedValue(deleteError);

      await clientService.deleteClient('client-123');

      expect(mockClientRepository.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockClientRepository.deleteClient).toHaveBeenCalledWith(
        'client-123',
      );
      expect(mockErrorHandler).toHaveBeenCalledWith(deleteError);
    });
  });
});
