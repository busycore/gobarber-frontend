import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers, DateUtils } from 'react-day-picker';

import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';
import { date } from 'yup';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';
import { useAuth } from '../../hooks/Auth';

import logoImg from '../../assets/logo.svg';
import api from '../../services/Api';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setappointments] = useState<IAppointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((eachMonthDay) => eachMonthDay.available === false)
      .map((eachDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, eachDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDatAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBr });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBr });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((eachAppointment) => {
      return parseISO(eachAppointment.date).getHours() < 12;
    });
  }, [appointments]);
  const afternoonAppointments = useMemo(() => {
    return appointments.filter((eachAppointment) => {
      return parseISO(eachAppointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((eachAppointment) =>
      isAfter(parseISO(eachAppointment.date), new Date()),
    );
  }, [appointments]);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<IAppointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((eachappointment) => {
          return {
            ...eachappointment,
            hourFormatted: format(parseISO(eachappointment.date), 'HH:mm'),
          };
        });
        setappointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horarios agendados:</h1>
          <p>
            {isToday(selectedDate) && <span> Hoje</span>}
            <span>{selectedDatAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento à seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo.</p>
            )}
            {morningAppointments.map((eachAppointment) => (
              <Appointment key={eachAppointment.id}>
                <span>
                  <FiClock />
                  {eachAppointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={eachAppointment.user.avatar_url}
                    alt={eachAppointment.user.name}
                  />
                  <strong>{eachAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste periodo.</p>
            )}
            {afternoonAppointments.map((eachAppointment) => (
              <Appointment key={eachAppointment.id}>
                <span>
                  <FiClock />
                  {eachAppointment.hourFormatted}
                </span>
                <div>
                  <img
                    src={eachAppointment.user.avatar_url}
                    alt={eachAppointment.user.name}
                  />
                  <strong>{eachAppointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
