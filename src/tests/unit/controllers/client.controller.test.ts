import * as clientController from '../../../modules/client/client.controller';
import * as clientService from '../../../modules/client/client.service';
import { Request, Response, NextFunction } from 'express';
import {
  mockCreateClientDto,
  mockUpdateClientDto,
  mockClient,
  mockClients,
} from '../../mocks/client.mock';
import { HttpStatus } from '../../../enums/http-status.enum';
import { ClientNotFoundError } from '../../../errors/ClientNotFoundError';
import { AppError } from '../../../errors/AppError';

jest.mock('../../../modules/client/client.service');
const mockClientService = clientService as jest.Mocked<typeof clientService>;

const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('Client Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create client and return 201 status', async () => {
      req.body = mockCreateClientDto;
      mockClientService.createClient.mockResolvedValue(mockClient);

      await clientController.createClient(req, res, next);

      expect(mockClientService.createClient).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockClient);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws an error', async () => {
      req.body = mockCreateClientDto;
      const serviceError = new AppError(
        'Failed to create client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockClientService.createClient.mockRejectedValue(serviceError);

      await clientController.createClient(req, res, next);

      expect(mockClientService.createClient).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serviceError);
    });

    it('should handle validation errors from service', async () => {
      req.body = { invalidData: 'invalid' };
      const validationError = new AppError(
        'Validation failed',
        HttpStatus.BAD_REQUEST,
      );
      mockClientService.createClient.mockRejectedValue(validationError);

      await clientController.createClient(req, res, next);

      expect(next).toHaveBeenCalledWith(validationError);
    });
  });

  describe('getAllClients', () => {
    it('should return all clients with 200 status', async () => {
      mockClientService.getAllClients.mockResolvedValue(mockClients);

      await clientController.getAllClients(req, res, next);

      expect(mockClientService.getAllClients).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockClients);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return empty array when no clients exist', async () => {
      mockClientService.getAllClients.mockResolvedValue([]);

      await clientController.getAllClients(req, res, next);

      expect(mockClientService.getAllClients).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith([]);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws an error', async () => {
      const serviceError = new AppError(
        'Database connection failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockClientService.getAllClients.mockRejectedValue(serviceError);

      await clientController.getAllClients(req, res, next);

      expect(mockClientService.getAllClients).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('getClientById', () => {
    it('should return client by id with 200 status', async () => {
      req.params = { id: 'client-123' };
      mockClientService.getClientById.mockResolvedValue(mockClient);

      await clientController.getClientById(req, res, next);

      expect(mockClientService.getClientById).toHaveBeenCalledWith(
        'client-123',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockClient);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ClientNotFoundError when client does not exist', async () => {
      req.params = { id: 'non-existent-id' };
      const notFoundError = new ClientNotFoundError('non-existent-id');
      mockClientService.getClientById.mockRejectedValue(notFoundError);

      await clientController.getClientById(req, res, next);

      expect(mockClientService.getClientById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it('should handle missing id parameter', async () => {
      req.params = {};
      mockClientService.getClientById.mockResolvedValue(mockClient);

      await clientController.getClientById(req, res, next);

      expect(mockClientService.getClientById).toHaveBeenCalledWith(undefined);
    });
  });

  describe('updateClient', () => {
    it('should update client and return 200 status', async () => {
      req.params = { id: 'client-123' };
      req.body = mockUpdateClientDto;
      const updatedClient = { ...mockClient, ...mockUpdateClientDto };
      mockClientService.updateClient.mockResolvedValue(updatedClient);

      await clientController.updateClient(req, res, next);

      expect(mockClientService.updateClient).toHaveBeenCalledWith(
        'client-123',
        mockUpdateClientDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(updatedClient);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ClientNotFoundError when client does not exist', async () => {
      req.params = { id: 'non-existent-id' };
      req.body = mockUpdateClientDto;
      const notFoundError = new ClientNotFoundError('non-existent-id');
      mockClientService.updateClient.mockRejectedValue(notFoundError);

      await clientController.updateClient(req, res, next);

      expect(mockClientService.updateClient).toHaveBeenCalledWith(
        'non-existent-id',
        mockUpdateClientDto,
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it('should handle validation errors for update data', async () => {
      req.params = { id: 'client-123' };
      req.body = { invalidField: 'invalid' };
      const validationError = new AppError(
        'Validation failed',
        HttpStatus.BAD_REQUEST,
      );
      mockClientService.updateClient.mockRejectedValue(validationError);

      await clientController.updateClient(req, res, next);

      expect(next).toHaveBeenCalledWith(validationError);
    });

    it('should handle empty update data', async () => {
      req.params = { id: 'client-123' };
      req.body = {};
      mockClientService.updateClient.mockResolvedValue(mockClient);

      await clientController.updateClient(req, res, next);

      expect(mockClientService.updateClient).toHaveBeenCalledWith(
        'client-123',
        {},
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete client and return 204 status', async () => {
      req.params = { id: 'client-123' };
      mockClientService.deleteClient.mockResolvedValue(mockClient);

      await clientController.deleteClient(req, res, next);

      expect(mockClientService.deleteClient).toHaveBeenCalledWith('client-123');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ClientNotFoundError when client does not exist', async () => {
      req.params = { id: 'non-existent-id' };
      const notFoundError = new ClientNotFoundError('non-existent-id');
      mockClientService.deleteClient.mockRejectedValue(notFoundError);

      await clientController.deleteClient(req, res, next);

      expect(mockClientService.deleteClient).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it('should handle foreign key constraint errors', async () => {
      req.params = { id: 'client-123' };
      const constraintError = new AppError(
        'Cannot delete client with active invoices',
        HttpStatus.CONFLICT,
      );
      mockClientService.deleteClient.mockRejectedValue(constraintError);

      await clientController.deleteClient(req, res, next);

      expect(mockClientService.deleteClient).toHaveBeenCalledWith('client-123');
      expect(next).toHaveBeenCalledWith(constraintError);
    });

    it('should handle missing id parameter', async () => {
      req.params = {};
      mockClientService.deleteClient.mockResolvedValue(mockClient);

      await clientController.deleteClient(req, res, next);

      expect(mockClientService.deleteClient).toHaveBeenCalledWith(undefined);
    });
  });
});
