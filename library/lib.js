const grpc = require("@grpc/grpc-js");
// import grpc from '@grpc/grpc-js'
const protoLoader = require("@grpc/proto-loader");
// import protoLoader from '@grpc/proto-loader'

const PROTO_PATH = "./packets.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const packets = grpc.loadPackageDefinition(packageDefinition).packets;

class GRPCClient {
    constructor(serverAddress = "localhost:50051") {
        this.client = new packets.PacketAPI(serverAddress, grpc.credentials.createInsecure());
    }

    queryOrder(orderDetails) {
        return new Promise((resolve, reject) => {
            this.client.QueryOrder(orderDetails, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    queryPayment(paymentDetails) {
        return new Promise((resolve, reject) => {
            this.client.QueryPayment(paymentDetails, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

module.exports = GRPCClient;
