'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.webhistoryrequestdatas = async (req, res) => {
    try {
        let { page } = req.query
        page = parseInt(page)
        if (page === undefined || isNaN(page)) { page = 1 }
        const historyRequestDatas = await prisma.history_Request_Datas.findMany({
            skip: (page - 1) * 10,
            take: 10,
            include: {
                send_data: true
            }
        });

        const results = historyRequestDatas.map(history => ({
            id_history_request_data: history.id_history_request_data,
            email: history.email,
            name: history.name,
            profession: history.profession,
            instances: history.instances,
            subject: history.subject,
            body: history.body,
            id_send_data: history.id_send_data,
            id_user: history.id_user,
            date: history.date,
            id_send_data: history.send_data.id_send_data,
            local_name: history.send_data.local_name,
            latin_name: history.send_data.latin_name,
            habitat: history.send_data.habitat,
            description: history.send_data.description,
            city: history.send_data.city,
            longitude: history.send_data.longitude,
            latitude: history.send_data.latitude,
            image: history.send_data.image,
            amount: history.send_data.amount,
            date_start: history.send_data.date_start,
            date_end: history.send_data.date_end
        }));
        
        const count = await prisma.history_Request_Datas.count();

        const pagination = {
            page,
            total_page: Math.ceil(count / 10),
            total_data: count,
        }

        return res.status(200).json({ status: 200, pagination, values: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

exports.webhistoryrequestdataid = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const history = await prisma.history_Request_Datas.findUnique({
            where: { id_history_request_data: id },
            include: {
                send_data: true
            }
        });

        if (!history) {
            return res.status(404).json({ status: 404, message: 'History Request Data not found' });
        }

        const result = {
            id_history_request_data: history.id_history_request_data,
            email: history.email,
            name: history.name,
            profession: history.profession,
            instances: history.instances,
            subject: history.subject,
            body: history.body,
            id_send_data: history.id_send_data,
            id_user: history.id_user,
            date: history.date,
            id_send_data: history.send_data.id_send_data,
            local_name: history.send_data.local_name,
            latin_name: history.send_data.latin_name,
            habitat: history.send_data.habitat,
            description: history.send_data.description,
            city: history.send_data.city,
            longitude: history.send_data.longitude,
            latitude: history.send_data.latitude,
            image: history.send_data.image,
            amount: history.send_data.amount,
            date_start: history.send_data.date_start,
            date_end: history.send_data.date_end
        };

        return res.status(200).json({ status: 200, values: [result] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};